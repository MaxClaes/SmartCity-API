require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');

const userModel = require('../model/userDB');
const addressModel = require('../model/addressDB');
const pool = require('../model/database');
const constant = require('../utils/constant');
const dto = require('../dto');
const error = require('../error/index');
const { validationResult } = require('express-validator');

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *              name:
 *                  type: string
 *              firstname:
 *                  type: string
 *              birthdate:
 *                  type: string
 *              email:
 *                  type: string
 *              registrationDate:
 *                  type: string
 *              gender:
 *                  type: string
 *              height:
 *                  type: number
 *              weight:
 *                  type: number
 *              gsm:
 *                  type: string
 *              role:
 *                  type: string
 *              address:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: number
 *                      country:
 *                          type: string
 *                      postalCode:
 *                          type: integer
 *                      city:
 *                          type: string
 *                      street:
 *                          type: string
 *                      number:
 *                          type: string
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Login:
 *          type: object
 *          properties:
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *                  format: password
 *          required:
 *              - email
 *              - password
 */
module.exports.login = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {email, password} = req.body;
        const client = await pool.connect();

        try {
            const result = await userModel.getUserLogin(client, email, password);
            const {userType, value} = result;

            if (userType === constant.ROLE_CLIENT || userType === constant.ROLE_ADMINISTRATOR || userType === constant.ROLE_MODERATOR) {
                const {client_id: id, name, firstname} = value;
                const payload = {status: userType, value: {id, name, firstname}};
                const token = jwt.sign(
                    payload,
                    process.env.SECRET_TOKEN,
                    {expiresIn: '1d'}   //Peut etre modifier
                );
                res.json({
                    token: token,
                    id: id,
                    name: name,
                    firstname: firstname
                });
            } else {
                res.status(404).json({error: [error.USER_NOT_FOUND]});
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
};
/**
 * @swagger
 * components:
 *  responses:
 *      UserInsert:
 *          description: the user has been added to database
 *  requestBodies:
 *      UserToInsert:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          name:
 *                              type: string
 *                          firstname:
 *                              type: string
 *                          birthdate:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *                              format: password
 *                          gender:
 *                              type: string
 *                          height:
 *                              type: number
 *                          weight:
 *                              type: number
 *                          gsm:
 *                              type: string
 *                          address:
 *                              type: object
 *                              properties:
 *                                  country:
 *                                      type: string
 *                                  postalCode:
 *                                      type: integer
 *                                  city:
 *                                      type: string
 *                                  street:
 *                                      type: string
 *                                  number:
 *                                      type: string
 *                      required:
 *                          - name
 *                          - firstname
 *                          - birthdate
 *                          - email
 *                          - password
 *                          - gender
 *                          - height
 *                          - weight
 */
module.exports.createUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {name, firstname, birthdate, email, password, gender, height, weight, gsm, address:addressObj} = req.body;
        const client = await pool.connect();

        try {
            client.query("BEGIN;");
            const {rows: usersEntities} = await userModel.getUserByEmail(client, email);
            const userEntity = usersEntities[0];

            if (userEntity === undefined) {
                let addressId = null;

                if (addressObj !== undefined) {
                    const {rows: addresses} = await addressModel.createAddress(client, addressObj.country, addressObj.postalCode, addressObj.city, addressObj.street, addressObj.number);
                    addressId = addresses[0].address_id;
                }

                await userModel.createUser(client, name, firstname, birthdate, email, password, new Date(), gender, height, weight, gsm, addressId);

                client.query("COMMIT;");
                res.sendStatus(201);
            } else {
                res.status(409).json({error: [error.EMAIL_CONFLICT]});
            }
        } catch (error) {
            client.query("ROLLBACK;");
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
};
/**
 * @swagger
 * components:
 *  responses:
 *      UserUpdated:
 *          description: the user has been updated
 *  requestBodies:
 *      UserToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          name:
 *                              type: string
 *                          firstname:
 *                              type: string
 *                          birthdate:
 *                              type: string
 *                          password:
 *                              type: string
 *                              format: password
 *                          height:
 *                              type: number
 *                          weight:
 *                              type: number
 *                          gsm:
 *                              type: string
 */
module.exports.updateUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {user:userObj, address:addressObj} = req.body;
        const userIdTexte = req.params.userId;
        const userId = parseInt(userIdTexte);
        const client = await pool.connect();

        try {
            client.query("BEGIN;");
            if (addressObj !== undefined) {
                await addressModel.updateAddress(client, addressObj.country, addressObj.postalCode, addressObj.city, addressObj.street, addressObj.number, addressObj.id);
            }
            if (userObj !== undefined) {
                await userModel.updateUser(client, userObj.name, userObj.firstname, userObj.gender, userObj.height, userObj.weight, userObj.gsm, userId);
            }
            client.query("COMMIT;");
            res.sendStatus(204);
        } catch (error) {
            client.query("ROLLBACK;");
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
};
/**
 * @swagger
 * components:
 *  responses:
 *      UsersFound:
 *          description: send back a list of users
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 */
module.exports.getAllUsers = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: usersEntities} = await userModel.getAllUsers(client);
        const userEntity = usersEntities[0];

        if(userEntity !== undefined) {
            const users = [];
            usersEntities.forEach(function(u) {
                users.push(dto.userDTO(u));
            });
            res.json(users);
        } else {
            res.status(404).json({error: [error.USER_NOT_FOUND]});
        }
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getAllUsersByName = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const name = req.params.name;
        const client = await pool.connect();

        try {
            const {rows: usersEntities} = await userModel.getUsersByName(client, name);

            if (usersEntities[0] !== undefined) {
                const users = [];
                usersEntities.forEach(function (u) {
                    users.push(dto.userDTO(u));
                });

                res.json(users);
            } else {
                res.status(404).json({error: [error.USER_NOT_FOUND]});
            }
        } catch (error) {
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}
/**
 * @swagger
 * components:
 *  responses:
 *      UserFound:
 *          description: Send the user
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      InternalError:
 *          description: Internal servor error
 */
module.exports.getUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const idTexte = req.params.userId;
        const id = parseInt(idTexte);
        const client = await pool.connect();

        try {
            const {rows: usersEntities} = await userModel.getUser(client, id);
            const userEntity = usersEntities[0];

            if (userEntity !== undefined) {
                res.json(dto.userDTO(userEntity));
            } else {
                res.status(404).json({error: [error.USER_NOT_FOUND]});
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}
/**
 * @swagger
 * components:
 *  responses:
 *      RoleChanged:
 *          description: The role has been changed
 *      InternalServorError:
 *          description: Internal servor error
 *  requestBodies:
 *      RoleToChangeTo:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          role:
 *                              type: string
 */
module.exports.changeRole = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {role} = req.body;
        const userIdTexte = req.params.userId;
        const userId = parseInt(userIdTexte);
        const client = await pool.connect();

        try {
            await userModel.changeRole(client, role.toUpperCase(), userId);
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.emailExists = async (email) => {
    const client = await pool.connect();

    try {
        return await userModel.emailExists(client, email);
    } catch (error){
        console.log(error);
    } finally {
        client.release();
    }
}
