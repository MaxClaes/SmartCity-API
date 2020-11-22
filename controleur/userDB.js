require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');

const pool = require('../modele/database');
const userDB = require('../modele/userDB');

// module.exports.login = async (req, res) => {
//     const {email, password} = req.body;
//
//     if(email === undefined || password === undefined){
//         res.sendStatus(400);
//     } else {
//         const client = await pool.connect();
//
//         try {
//             const result = await userDB.getUser(client, email, password);
//             const {userType, value} = result;
//
//             if (userType === "INCONNU") {
//                 res.sendStatus(404);
//
//             } else if (userType === "ADMINISTRATOR") {
//                 const {id, nom} = value;
//                 const payload = {status: userType, value: {id, nom}};
//                 const token = jwt.sign(
//                     payload,
//                     process.env.SECRET_TOKEN,
//                     {expiresIn: '1d'}
//                 );
//                 res.json(token);
//
//             } else if (userType === "MODERATOR") {
//                 const {id, nom} = value;
//                 const payload = {status: userType, value: {id, nom}};
//                 const token = jwt.sign(
//                     payload,
//                     process.env.SECRET_TOKEN,
//                     {expiresIn: '1d'}
//                 );
//                 res.json(token);
//
//             } else {
//                 const {id, nom, prenom} = value;
//                 const payload = {status: userType, value: {id, nom, prenom}};
//                 const token = jwt.sign(
//                     payload,
//                     process.env.SECRET_TOKEN,
//                     {expiresIn: '1d'}   //Peut etre modifier
//                 );
//                 res.json(token);
//
//             }
//         } catch (e) {
//             console.log(e);
//             res.sendStatus(500);
//         } finally {
//             client.release();
//         }
//     }
// };

module.exports.login = async (req, res) => {
    const {email, password} = req.body;

    if(email === undefined || password === undefined){
        res.sendStatus(400);
    } else {
        const client = await pool.connect();

        try {
            const result = await userDB.getUser(client, email, password);
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