const { body , param } = require('express-validator');

module.exports = {
    labelValidation : [
        param("label")
            .trim().not().isEmpty().withMessage("Label is empty.")
            .trim().isString().withMessage("Label is not a string."),
    ],
    createModifyDrinkValidation : [
        body("label")
            .trim().not().isEmpty().withMessage("label is empty.")
            .trim().isString().withMessage("Label is not a string."),
        body("prcAlcohol")
            .isFloat({min : 0, max : 100}).withMessage("PrcAlcohol should be between 0 and 100"),
        body("quantity")
            .isFloat({min : 0}).withMessage("Quantity is less than 0")
    ],
    drinkIdValidation: [
        param("drinkId")
            .exists().withMessage("DrinkId is empty.")
            .toInt().not().isIn([null]).withMessage("DrinkId is not a number.")
            .isInt({min: 0}).withMessage("DrinkId is less than 0."),
    ],
    drinkNumberReportValidation: [
        param("number")
            .exists().withMessage("Number of increment is empty.")
            .isIn(["1", "-1"]).withMessage("Number must be 1/-1"),
    ]
};


