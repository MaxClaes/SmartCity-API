const pool = require("../../model/database");
const userModel = require('../../model/userDB')
const userController = require('../../controleur/userDB');
const constant = require('../../utils/constant');
const error = require('../../error');
const { body , param , check} = require('express-validator');

module.exports = {
    userRegistrationValidation : [
        body("name")
            .trim().not().isEmpty().withMessage("Name is empty.")
            .trim().isString().withMessage("Name is not a string."),
        body("firstname")
            .trim().not().isEmpty().withMessage("Firstname is empty.")
            .trim().isString().withMessage("Firstname is not a string."),
        body("birthdate")
            .isISO8601().toDate().withMessage("Birthdate is not a date."),
        body("email")
            .normalizeEmail().isEmail().withMessage("Email is not an email.")
            .custom(value => {
                return userController.emailExists(value).then(user => {
                    if (user) {
                        return Promise.reject("Email already in use");
                    }
                });
            }),
        body("password")
            .isString().withMessage("Password is not hexadecimal")
            .isLength({min : 8}).withMessage("Password is to short"),
        body("gender")
            .isLength({min : 1, max : 1}).withMessage("Gender has more/less than one character."),
        body("height")
            .not().isString().withMessage("Height is not a number.")
            .isFloat({min : 0}).withMessage("Height is less than 0"),
        body("weight")
            .not().isString().withMessage("Weight is not a number.")
            .isFloat({min : 0}).withMessage("Weight is less than 0"),
        body("gsm", "GSM is not a string.")
            .trim().not().isEmpty().withMessage("GSM is empty.")
            .isString().withMessage("GSM is not a string."),
        check("address.country")
            .trim().not().isEmpty().withMessage("Country is empty.")
            .trim().isString().withMessage("Country is not a string."),
        body("address.postalCode")
            .not().isString().withMessage("PostalCode is not a number."),
        body("address.city")
            .trim().not().isEmpty().withMessage("City is empty.")
            .trim().isString().withMessage("City is not a string."),
        body("address.street")
            .trim().not().isEmpty().withMessage("Street is empty.")
            .trim().isString().withMessage("Street is not a string."),
        body("address.number")
            .trim().not().isEmpty().withMessage("Number is empty.")
            .trim().isString().withMessage("Number is not a string.")
    ],
    loginValidation : [
        body("email")
            .normalizeEmail().isEmail().withMessage("Email is not an email."),
        body("password")
            .isLength({min : 8}).withMessage("Password is to short")
    ],
    userUpdateValidation : [
        body("name")
            .trim().not().isEmpty().withMessage("Name is empty.")
            .trim().isString().withMessage("Name is not a string."),
        body("firstname")
            .trim().not().isEmpty().withMessage("Firstname is empty.")
            .trim().isString().withMessage("Firstname is not a string."),
        body("birthdate")
            .isISO8601().toDate().withMessage("Birthdate is not a date."),
        body("email")
            .normalizeEmail().isEmail().withMessage("Email is not an email.")
            .custom(value => {
                return userController.emailExists(value).then(user => {
                    if (user) {
                        return Promise.reject("Email already in use");
                    }
                });
            }),
        body("password")
            .isLength({min : 8}).withMessage("Password is to short"),
        body("height")
            .not().isString().withMessage("Height is not a number.")
            .isFloat({min : 0}).withMessage("Height is less than 0"),
        body("weight")
            .not().isString().withMessage("Weight is not a number.")
            .isFloat({min : 0}).withMessage("Weight is less than 0"),
        body("gsm", "GSM is not a string.")
            .trim().not().isEmpty().withMessage("GSM is empty.")
            .isString().withMessage("GSM is not a string."),
    ],
    changeRoleValidation : [
        body("userId")
            .not().isString().withMessage("userId is not a number.")
            .isInt({min : 0}).withMessage("userId is less than 0.")
            .custom(value => {
                return userModel.userExists(value).then(user => {
                    if (!user) {
                        return Promise.reject("User does not exist.");
                    }
                });
            }),
        body("role")
            .isString().withMessage("Role is not a string.")
            .toUpperCase().isIn([constant.ROLE_CLIENT, constant.ROLE_MODERATOR, constant.ROLE_ADMINISTRATOR]),
    ],
    userIdValidation: [
        param("userId")
            .exists().withMessage("UserId is empty.")
            .toInt().not().isIn([null]).withMessage("UserId is not a number.")
            .isInt({min: 0}).withMessage("UserId is less than 0."),
    ],
};

module.exports.userExists = async (req, res, next) => {
    if (req.session) {
        const userIdTexte = req.params.userId;
        const userId = parseInt(userIdTexte);

        if (isNaN(userId)) {
            res.status(400).json({error: error.INVALID_PARAMETER});
        } else {
            const client = await pool.connect();

            try {
                if(await userModel.userExists(client, userId)) {
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
