require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');

const pool = require('../modele/database');
const UserModel = require('../modele/userDB');
const AddressModel = require('../modele/addressDB');
const Constants = require('../utils/constant');
const DTO = require('../dto/dto');

module.exports.login = async (req, res) => {
    const {email, password} = req.body;

    if (email === undefined || password === undefined) {
        res.status(400).json({error: "Email/password incorrect"});
    } else {
        const client = await pool.connect();

        try {
            const result = await UserModel.getUserLogin(client, email, password);
            const {userType, value} = result;

            if (userType === Constants.ROLE_CLIENT || userType === Constants.ROLE_ADMINISTRATOR || userType === Constants.ROLE_MODERATOR) {
                const {client_id: id, name, firstname} = value;
                const payload = {status: userType, value: {id, name, firstname}};
                const token = jwt.sign(
                    payload,
                    process.env.SECRET_TOKEN,
                    {expiresIn: '1d'}   //Peut etre modifier
                );
                res.json(token);
            } else {
                res.sendStatus(404);
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
    const {name, firstname, birthdate, email, password, height, weight, gsm, address:addressObj} = req.body;

    if (name === undefined || firstname === undefined || birthdate === undefined || email === undefined ||
        password === undefined || password.trim() === "" || height === undefined || weight === undefined ||
        gsm === undefined || addressObj.country === undefined || addressObj.postalCode === undefined ||
        addressObj.city === undefined || addressObj.street === undefined || addressObj.number === undefined) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();

        try {
            const user = await UserModel.getUserByEmail(client, email);

            if (user === undefined) {
                client.query("BEGIN;");

                const addresses = await AddressModel.createAddress(client, addressObj.country, addressObj.postalCode, addressObj.city, addressObj.street, addressObj.number);
                const addressId = addresses.rows[0].address_id;

                if (addressId !== undefined) {
                    await UserModel.createUser(client, name, firstname, birthdate, email, password, new Date(), height, weight, gsm, addressId);
                    client.query("COMMIT;");
                    res.sendStatus(201);
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.sendStatus(409);
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
    if (req.session) {
        const {name, firstname, birthdate, email, password, height, weight, gsm} = req.body;

        if (name === undefined && firstname === undefined && birthdate === undefined && email === undefined &&
            password === undefined && height === undefined && weight === undefined && gsm === undefined) {
            res.sendStatus(400);
        } else {
            const client = await pool.connect();

            try {
                await UserModel.updateUser(client, name, firstname, birthdate, email, password, height, weight, gsm, req.session.id);
                res.sendStatus(204);
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        }
    } else {
        res.sendStatus(401);
    }
};

module.exports.getAllUsers = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: usersEntities} = await UserModel.getAllUsers(client);
        const userEntity = usersEntities[0];

        if(userEntity !== undefined) {
            const users = [];
            usersEntities.forEach(function(u) {
                users.push(DTO.userDTO(u));
            });
            res.json(users);
        } else {
            res.sendStatus(404);
        }
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getUser = async (req, res) => {
    const client = await pool.connect();
    const idTexte = req.params.id;
    const id = parseInt(idTexte);

    try {
        const {rows: usersEntities} = await UserModel.getUser(client, id);
        const userEntity = usersEntities[0];

        if(userEntity !== undefined) {
            res.json(DTO.userDTO(userEntity));
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.changeRole = async (req, res) => {
    const {userId, role} = req.body;

    if (userId === undefined || role === undefined || isNaN(userId) ||
        (role.toUpperCase() !== Constants.ROLE_CLIENT && role.toUpperCase() !== Constants.ROLE_MODERATOR && role.toUpperCase() !== Constants.ROLE_ADMINISTRATOR)) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();

        try {
            await UserModel.changeRole(client, role.toUpperCase(), userId);
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}
