const userController = require('../../controleur/userDB');
const constant = require('../../utils/constant');
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
            .isLength({min : 8}).withMessage("Password is too short"),
        body("gender")
            .isLength({min : 1, max : 1}).withMessage("Gender has more/less than one character.")
            .toUpperCase().isIn([constant.GENDER_MAN, constant.GENDER_WOMAN]).withMessage("Gender must be M or W."),
        body("height")
            .not().isString().withMessage("Height is not a number.")
            .isFloat({min : 0}).withMessage("Height is less than 0"),
        body("weight")
            .not().isString().withMessage("Weight is not a number.")
            .isFloat({min : 0}).withMessage("Weight is less than 0"),
        body("gsm", "GSM is not a string.")
            .trim().not().isEmpty().withMessage("GSM is empty.")
            .isString().withMessage("GSM is not a string."),
        body("address.country")
            .if(body("address").exists())
            .trim().not().isEmpty().withMessage("Country is empty.")
            .trim().isString().withMessage("Country is not a string."),
        body("address.postalCode")
            .if(body("address").exists())
            .trim().not().isEmpty().withMessage("Postal code is empty.")
            .not().isString().withMessage("PostalCode is not a number."),
        body("address.city")
            .if(body("address").exists())
            .trim().not().isEmpty().withMessage("City is empty.")
            .trim().isString().withMessage("City is not a string."),
        body("address.street")
            .if(body("address").exists())
            .trim().not().isEmpty().withMessage("Street is empty.")
            .trim().isString().withMessage("Street is not a string."),
        body("address.number")
            .if(body("address").exists())
            .trim().not().isEmpty().withMessage("Number is empty.")
            .trim().isString().withMessage("Number is not a string.")
    ],
    loginValidation : [
        body("email")
            .trim().not().isEmpty().withMessage("Email is empty.")
            .normalizeEmail().isEmail().withMessage("Email is not an email."),
        body("password")
            .trim().not().isEmpty().withMessage("Password is empty.")
            .isLength({min : 8}).withMessage("Password is too short")
    ],
    userUpdateValidation : [
        body("user.name")
            .if(body("name").exists())
            .trim().not().isEmpty().withMessage("Name is empty.")
            .trim().isString().withMessage("Name is not a string."),
        body("user.firstname")
            .if(body("firstname").exists())
            .trim().not().isEmpty().withMessage("Firstname is empty.")
            .trim().isString().withMessage("Firstname is not a string."),
        body("user.height")
            .if(body("height").exists())
            .not().isString().withMessage("Height is not a number.")
            .isFloat({min : 0}).withMessage("Height is less than 0"),
        body("user.weight")
            .if(body("weight").exists())
            .not().isString().withMessage("Weight is not a number.")
            .isFloat({min : 0}).withMessage("Weight is less than 0"),
        body("user.gsm", "GSM is not a string.")
            .if(body("gsm").exists())
            .trim().not().isEmpty().withMessage("GSM is empty.")
            .isString().withMessage("GSM is not a string.")
    ],
    addressUpdateValidation : [
        body("address.country")
            .if(body("address").exists())
            .trim().not().isEmpty().withMessage("Country is empty.")
            .trim().isString().withMessage("Country is not a string."),
        body("address.postalCode")
            .if(body("address").exists())
            .trim().not().isEmpty().withMessage("Postal code is empty.")
            .isString().withMessage("PostalCode is not a number."),
        body("address.city")
            .if(body("address").exists())
            .trim().not().isEmpty().withMessage("City is empty.")
            .trim().isString().withMessage("City is not a string."),
        body("address.street")
            .if(body("address").exists())
            .trim().not().isEmpty().withMessage("Street is empty.")
            .trim().isString().withMessage("Street is not a string."),
        body("address.number")
            .if(body("address").exists())
            .trim().not().isEmpty().withMessage("Number is empty.")
            .trim().isString().withMessage("Number is not a string.")
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
