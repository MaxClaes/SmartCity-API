const pool = require("../model/database");
const drinkModel = require('../model/drinkDB')
const constant = require('../utils/constant');
const error = require('../error/index');

module.exports.drinkExists = async (req, res, next) => {
    if (req.session) {
        const drinkIdTexte = req.params.drinkId;
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
