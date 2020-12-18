const pool = require("../../model/database");
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

            if (userId === req.session.id) {
                next();
            } else {
                let sameBand = false;
                const client = await pool.connect();

                try {
                    const {rows: bandsEntities} = await bandModel.getBandsByUserId(client, req.session.id);

                    if (bandsEntities[0] !== undefined) {
                        for (let i = 0 ; i < bandsEntities.length ; i++) {
                            if (await bandModel.userExists(client, bandsEntities[i].band_id, userId)) {
                                sameBand = true;
                            }
                        }
                        if (sameBand) {
                            next();
                        } else {
                            res.sendStatus(404);
                        }
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
