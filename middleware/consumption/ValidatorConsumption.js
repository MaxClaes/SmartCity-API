const pool = require("../../model/database");
const drinkModel = require('../../model/drinkDB');
const constant = require('../../utils/constant');
const error = require('../../error');
const consumptionController = require('../../controleur/consumptionDB');
const { body , param , check} = require('express-validator');

module.exports = {
    createConsumptionValidation : [
        body("date")
            .if(body("date").exists)
            .isISO8601().toDate().withMessage("Date is not a date."),
        param("id")
            .exists().withMessage("Id is empty.")
            .toInt().not().isIn([null]).withMessage("Id is not a number.")
            .isInt({min: 0}).withMessage("Id is less than 0."),
    ],
    updateConsumptionValidation : [
        body("date")
            .isISO8601().toDate().withMessage("Date is not a date."),
        body("consumptionId")
            .exists().withMessage("ConsumptionId is empty.")
            .toInt().not().isIn([null]).withMessage("ConsumptionId is not a number.")
            .isInt({min: 0}).withMessage("ConsumptionId is less than 0.")
            .custom(value => {
                return consumptionController.consumptionExists(value).then(consumption => {
                    if (!consumption) {
                        return Promise.reject("Consumption does not exists.");
                    }
                });
            }),
    ],
    deleteConsumptionValidation : [
        param("id")
            .exists().withMessage("Id is empty.")
            .toInt().not().isIn([null]).withMessage("Id is not a number.")
            .isInt({min: 0}).withMessage("Id is less than 0.")
            .custom(value => {
                return consumptionController.consumptionExists(value).then(consumption => {
                    if (!consumption) {
                        return Promise.reject("Consumption does not exists.");
                    }
                });
            }),
    ]
};
