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
            .optional({nullable: true})
            .trim().not().isEmpty().withMessage("Country is empty.")
            .trim().isString().withMessage("Country is not a string."),
        body("address.postalCode")
            .optional({nullable: true})
            .not().isString().withMessage("PostalCode is not a number."),
        body("address.city")
            .optional({nullable: true})
            .trim().not().isEmpty().withMessage("City is empty.")
            .trim().isString().withMessage("City is not a string."),
        body("address.street")
            .optional({nullable: true})
            .trim().not().isEmpty().withMessage("Street is empty.")
            .trim().isString().withMessage("Street is not a string."),
        body("address.number")
            .optional({nullable: true})
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
    roleValidation : [
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
