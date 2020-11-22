require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');

const pool = require('../modele/database');
const UserModele = require('../modele/userDB');
const AddressModele = require('../modele/addressDB');

module.exports.login = async (req, res) => {
    const {email, password} = req.body;

    if(email === undefined || password === undefined){
        res.sendStatus(400);
    } else {
        const client = await pool.connect();

        try {
            const result = await UserModele.getUserLogin(client, email, password);
            const {userType, value} = result;

            if (userType === "CLIENT" || userType === "ADMINISTRATOR" || userType === "MODERATOR") {
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
        const clientObj = req.session;
        const toUpdate = req.body;
        const newData = {};
        let doUpdate = false;

        if (toUpdate.name !== undefined || toUpdate.firstname !== undefined || toUpdate.birthdate !== undefined || toUpdate.email !== undefined ||
            toUpdate.password !== undefined || toUpdate.height !== undefined || toUpdate.weight !== undefined || toUpdate.gsm !== undefined ||
            toUpdate.country !== undefined || toUpdate.postalCode !== undefined || toUpdate.city !== undefined ||
            toUpdate.street !== undefined || toUpdate.number !== undefined) {

            const client = await pool.connect();

            try{
                await ClientDB.updateClient(
                    client,
                    toUpdate.name,
                    toUpdate.firstname,
                    toUpdate.birthdate,
                    toUpdate.email,
                    toUpdate.password,
                    toUpdate.height,
                    toUpdate.weight,
                    toUpdate.gsm,

                );
                res.sendStatus(204);
            }
            catch (e) {
                console.log(e);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        } else {
            res.sendStatus(400);
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

        if(user !== undefined){
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

    try {
        const {rows: users} = await UserModele.getUser(client, req.session.id);
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
