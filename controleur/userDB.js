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
                res.json(token);
            } else {
                res.status(404).json({error: error.USER_NOT_FOUND});
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
};

module.exports.createUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {name, firstname, birthdate, email, password, gender, height, weight, gsm, address:addressObj} = req.body;
        const client = await pool.connect();

        try {
            const {rows: usersEntities} = await userModel.getUserByEmail(client, email);
            const userEntity = usersEntities[0];

            if (userEntity === undefined) {
                client.query("BEGIN;");

                const {rows: addresses} = await addressModel.createAddress(client, addressObj.country, addressObj.postalCode, addressObj.city, addressObj.street, addressObj.number);
                const addressId = addresses[0].address_id;
                await userModel.createUser(client, name, firstname, birthdate, email, password, new Date(), gender, height, weight, gsm, addressId);

                client.query("COMMIT;");
                res.sendStatus(201);
            } else {
                res.status(409).json({error: error.EMAIL_CONFLICT});
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

module.exports.updateUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {name, firstname, birthdate, email, password, height, weight, gsm} = req.body;
        const client = await pool.connect();

        try {
            await userModel.updateUser(client, name, firstname, birthdate, email, password, height, weight, gsm, req.session.id);
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
};

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

module.exports.changeRole = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {userId, role} = req.body;
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
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.userExists = async (id) => {
    const client = await pool.connect();

    try {
        return await userModel.userExists(client, id);
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}