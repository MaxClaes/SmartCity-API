const pool = require("../../model/database");
const constant = require("../../utils/constant");
const error = require("../../error/index");
const bandModel = require("../../model/bandDB");
const { validationResult } = require("express-validator");

module.exports.canGetAlcoholLevel = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        if (req.session) {
            const userIdTexte = req.params.userId;
            const userId = parseInt(userIdTexte);
            const client = await pool.connect();

            if (userId === req.session.id) {
                next();
            } else {
                try {
                    const {rows: bandsEntities} = await bandModel.getBandsByUserId(client, userId);

                    if (bandsEntities[0] !== undefined) {
                        await Promise.all(bandsEntities.map(async (b) => {
                            if (await bandModel.userExists(client, b.band_id, userId)) {
                                next();
                            }
                        }));
                    } else {
                        res.status(404).json({error: [error.BAND_NOT_FOUND]});
                    }
                } catch (error) {
                    console.log(error);
                    res.sendStatus(500);
                } finally {
                    client.release();
                }
            }
        } else {
            res.status(403).json({error: [error.UNAUTHENTICATED]});
        }
    }
}
