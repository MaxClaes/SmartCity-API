const { body , param , check} = require('express-validator');

module.exports = {
    idValidation: [
        param("id")
            .exists().withMessage("Id is empty.")
            .toInt().not().isIn([null]).withMessage("Id is not a number.")
            .isInt({min: 0}).withMessage("Id is less than 0."),
    ]
}