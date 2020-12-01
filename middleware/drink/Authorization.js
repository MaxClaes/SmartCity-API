const drinkModel = require("../model/drinkDB");
const pool = require("../model/database");
const constant = require('../utils/constant');
const error = require('../error/index');
const { validationResult } = require('express-validator');

module.exports.canModifyOrDeleteDrink = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        if (!req.session) {
            res.status(401).json({error: error.UNAUTHENTICATED});
        } else {
            const drinkIdTexte = req.params.drinkId;
            const drinkId = parseInt(drinkIdTexte);

            if (req.session.authLevel === constant.ROLE_ADMINISTRATOR || req.session.authLevel === constant.ROLE_MODERATOR) {
                next();
            } else {
                const client = await pool.connect();

                try {
                    const {rows: drinks} = await drinkModel.getDrinkById(client, id);
                    const drink = drinks[0];

                    if (drink !== undefined) {
                        if (parseInt(drink.created_by) === req.session.id) {
                            next();
                        } else {
                            res.status(403).json({error: error.ACCESS_RESTRICTED});
                        }
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
        }
    }
}
