require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');

const pool = require('../modele/database');
const UserModele = require('../modele/userDB');
const AddressModele = require('../modele/addressDB');
const Constants = require('../utils/constant');

module.exports.login = async (req, res) => {
    const {email, password} = req.body;

    if(email === undefined || password === undefined){
        res.sendStatus(400);
    } else {
        const client = await pool.connect();

        try {
            const result = await UserModele.getUserLogin(client, email, password);
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
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
};

module.exports.createUser = async (req, res) => {
    const {name, firstname, birthdate, email, password, height, weight, gsm, address:addressObj} = req.body;

    if(name === undefined || firstname === undefined || birthdate === undefined || email === undefined ||
        password === undefined || height === undefined || weight === undefined || gsm === undefined ||
        addressObj.country === undefined || addressObj.postalCode === undefined || addressObj.city === undefined ||
        addressObj.street === undefined || addressObj.number === undefined) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();

        try {
            client.query("BEGIN;");

            await AddressModele.createAddress(client, addressObj.country, addressObj.postalCode, addressObj.city, addressObj.street, addressObj.number);
            const {rows: addresses} = await AddressModele.getAddress(client, addressObj.country, addressObj.postalCode, addressObj.city, addressObj.street, addressObj.number);
            const address = addresses[0];

            if(address !== undefined){
                await UserModele.createUser(client, name, firstname, birthdate, email, password, height, weight, gsm, address.id);
                client.query("COMMIT;");
                res.sendStatus(201);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            client.query("ROLLBACK;");
            console.log(e);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
};

module.exports.updateUser = async (req, res) => {
    if(req.session) {
        const {name, firstname, birthdate, email, password, height, weight, gsm} = req.body;

        if(name === undefined && firstname === undefined && birthdate === undefined && email === undefined &&
            password === undefined && height === undefined && weight === undefined && gsm === undefined) {
            res.sendStatus(400);
        } else {
            const client = await pool.connect();

            try {
                await UserModele.updateUser(client, name, firstname, birthdate, email, password, height, weight, gsm, req.session.id);
                res.sendStatus(204);
            } catch (e) {
                console.log(e);
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
        const {rows: users} = await UserModele.getAllUsers(client);
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
        const {rows: users} = await UserModele.getUser(client, id);
        const user = users[0];

        if(user !== undefined){
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.changeRole = async (req, res) => {
    const {targetIdUser, newRole} = req.body;

    if(targetIdUser === undefined || newRole === undefined || isNaN(targetIdUser)){
        res.sendStatus(400);
    } else {
        const client = await pool.connect();

        try {
            await UserModele.changeRole(client, newRole.toUpperCase(), targetIdUser);
            res.sendStatus(204);
        } catch (e) {
            console.log(e);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}