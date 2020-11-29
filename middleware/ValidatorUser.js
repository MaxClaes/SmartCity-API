
const pool = require("../model/database");
const constant = require('../utils/constant');
const error = require('../error/index');

module.exports.authenticationValids = async (req, res, next) => {
    const {email, password} = req.body;

    if (email === undefined || password === undefined || email === null || password === null) {
        res.status(400).json({error: error.BAD_AUTHENTICATION});
    } else {
        next();
    }
}

module.exports.parametersCorrect = async (req, res, next) => {
    const {name, firstname, birthdate, email, password, height, weight, gsm, address:addressObj} = req.body;

    // if (name === undefined || firstname === undefined || birthdate === undefined || email === undefined ||
    //     height === undefined || weight === undefined ||
    //     gsm === undefined || addressObj.country === undefined || addressObj.postalCode === undefined ||
    //     addressObj.city === undefined || addressObj.street === undefined || addressObj.number === undefined) {
    //     res.status(400).json({error: error.MISSING_PARAMETER});
    // } else {
    //     if (name.trim() === "" || firstname.trim() === "" || email.trim() === "" ||
    //         password.trim() === "" || gsm.trim() === "" || addressObj.country.trim() === "" || addressObj.city.trim() === "" ||
    //         addressObj.street.trim() === "") {
    //         res.status(400).json({error: error.EMPTY_PARAMETER});
    //     } else {
    //         if (!name instanceof String || !firstname instanceof String || !birthdate instanceof Date || !email instanceof String ||
    //             !password instanceof String || !isNaN(height) || !isNaN(weight) || !gsm instanceof String) {
    //
    //         } else {
    //             next();
    //         }
    //     }
    // }
}

module.exports.userExists = async (req, res, next) => {
    if (req.session) {
        const userIdTexte = req.params.userId;
        const userId = parseInt(userIdTexte);
        const client = await pool.connect();

        if (isNaN(userId)) {
            res.sendStatus(400);
        } else {
            try {
                if(await userModel.userExist(client, userId)) {
                    next();
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
    } else {
        res.sendStatus(403);
    }
}

module.exports.roleIsValid = (req, res, next) => {
    if (req.session) {
        const {role} = req.body;

        if (role !== undefined && (role.toUpperCase() === constant.ROLE_ADMINISTRATOR || role.toUpperCase() === constant.ROLE_MODERATOR|| role.toUpperCase() === constant.ROLE_CLIENT)) {
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
}
