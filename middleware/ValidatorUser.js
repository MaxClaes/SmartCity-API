const pool = require("../model/database");
const userModel = require('../model/userDB')
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

        if (isNaN(userId)) {
            res.status(400).json({error: error.INVALID_PARAMETER});
        } else {
            const client = await pool.connect();

            try {
                if(await userModel.userExist(client, userId)) {
                    next();
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
    } else {
        res.status(403).json({error: error.UNAUTHENTICATED});
    }
}

module.exports.roleIsValid = (req, res, next) => {
    if (req.session) {
        const {role} = req.body;

        if (role !== undefined && (role.toUpperCase() === constant.ROLE_ADMINISTRATOR || role.toUpperCase() === constant.ROLE_MODERATOR|| role.toUpperCase() === constant.ROLE_CLIENT)) {
            next();
        } else {
            res.status(400).json({error: error.INVALID_PARAMETER});
        }
    } else {
        res.status(403).json({error: error.UNAUTHENTICATED});
    }
}
