const bandModel = require('../../model/bandDB');
const pool = require("../../model/database");
const constant = require('../../utils/constant');
const error = require('../../error');
const { body , param } = require('express-validator');

module.exports = {
    bandIdValidation : [
        param("bandId")
            .exists().withMessage("BandId is empty.")
            .toInt().not().isIn([null]).withMessage("BandId is not a number.")
            .isInt({min: 0}).withMessage("BandId is less than 0."),
    ],
    createBandValidation : [
        body("label")
            .trim().not().isEmpty().withMessage("Label is empty.")
            .trim().isString().withMessage("Label is not a string."),
    ],
    roleValidation : [
        body("role")
            .isString().withMessage("Role is not a string.")
            .toUpperCase().isIn([constant.ROLE_CLIENT, constant.ROLE_ADMINISTRATOR]),
    ],
    statusValidation : [
        body("status")
            .isString().withMessage("Status is not a string.")
            .toUpperCase().isIn([constant.STATUS_ACCEPTED, constant.STATUS_REJECTED]),
    ]
};
