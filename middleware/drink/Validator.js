const pool = require("../../model/database");
const drinkModel = require('../../model/drinkDB');
const constant = require('../../utils/constant');
const error = require('../../error');
const { body , param , check} = require('express-validator');

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
            .not().isString().withMessage("PrcAlcohol is not a number.")
            .isFloat({min : 0, max : 100}).withMessage("PrcAlcohol should be between 0 and 100"),
        body("quantity")
            .not().isString().withMessage("Quantity is not a number.")
            .isFloat({min : 0}).withMessage("Quantity is less than 0")
    ],
    drinkIdValidation: [
        param("drinkId")
            .exists().withMessage("DrinkId is empty.")
            .toInt().not().isIn([null]).withMessage("DrinkId is not a number.")
            .isInt({min: 0}).withMessage("DrinkId is less than 0."),
    ],
};

module.exports.drinkExists = async (req, res, next) => {
    if (req.session) {
        const drinkIdTexte = req.params.id;
        const drinkId = parseInt(drinkIdTexte);

        if (isNaN(drinkId)) {
            res.status(400).json({error: error.INVALID_PARAMETER});
        } else {
            const client = await pool.connect();

            try {
                if(await drinkModel.drinkExists(client, drinkId)) {
                    next();
                } else {
                    res.status(404).json({error: error.DRINK_NOT_FOUND});
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
