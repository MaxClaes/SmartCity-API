require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');

const pool = require('../modele/database');
const UserModel = require('../modele/userDB');
const AddressModel = require('../modele/addressDB');
const Constants = require('../utils/constant');

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
                const {id, name, firstname} = value;
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

                await AddressModel.createAddress(client, addressObj.country, addressObj.postalCode, addressObj.city, addressObj.street, addressObj.number);
                const {rows: addresses} = await AddressModel.getAddress(client, addressObj.country, addressObj.postalCode, addressObj.city, addressObj.street, addressObj.number);
                const address = addresses[0];

                if (address !== undefined) {
                    await UserModel.createUser(client, name, firstname, birthdate, email, password, new Date(), height, weight, gsm, address.id);
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
        const {rows: users} = await UserModel.getAllUsers(client);
        const user = users[0];

        const usersFormated = [];
        users.forEach(function(u) {
            console.log(u.id);
            usersFormated.push(JSON.parse({
                "id":u.id,
                "name":u.name,
                "address":{
                    "id":u.address.id
                }
            }));
        });

        // for (const i = 0 ; i < users.length ; i++) {
        //     t += JSON.parse('');
        // }

        if(user !== undefined){
            // res.json({
            //     id: user.id,
            //     name: user.name,
            //     first: user.firstname
            // });
            res.json(usersFormated);
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
        const {rows: users} = await UserModel.getUser(client, id);
        const user = users[0];

        if(user !== undefined) {
            res.json(user);
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
    const {targetUserId, targetNewRole} = req.body;

    if (targetUserId === undefined || targetNewRole === undefined || isNaN(targetUserId) ||
        (targetNewRole.toUpperCase() !== Constants.ROLE_CLIENT && targetNewRole.toUpperCase() !== Constants.ROLE_MODERATOR && targetNewRole.toUpperCase() !== Constants.ROLE_ADMINISTRATOR)) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();

        try {
            await UserModel.changeRole(client, targetNewRole.toUpperCase(), targetUserId);
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}