const drinkModel = require("../../model/drinkDB");
const pool = require("../../model/database");
const constant = require("../../utils/constant");
const error = require("../../error/index");
const bandModel = require("../../model/bandDB");
const { validationResult } = require("express-validator");

module.exports.hasJoinedBand = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        if (req.session) {
            const bandIdTexte = req.params.bandId;
            const bandId = parseInt(bandIdTexte);
            const client = await pool.connect();

            try {
                if (await bandModel.userExists(client, bandId, req.session.id)) {
                    const {rows: status} = await bandModel.getStatus(client, bandId, req.session.id)
                    const userStatus = status[0].status;

                    if (userStatus === constant.STATUS_ACCEPTED) {
                        next();
                    } else {
                        res.status(400).json({error: [error.STATUS_NOT_ACCEPTED_IN_BAND]});
                    }
                } else {
                    res.status(404).json({error: [error.IDENTIFIED_USER_NOT_FOUND_IN_BAND]});
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        } else {
            res.status(403).json({error: [error.UNAUTHENTICATED]});
        }
    }
}

module.exports.isAdminAndUserSearchExists = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        if (req.session) {
            const bandIdTexte = req.params.bandId;
            const bandId = parseInt(bandIdTexte);
            const client = await pool.connect();

            try {
                if (await bandModel.userExists(client, bandId, req.session.id)) {
                    if (await bandModel.isAdministratorInBand(client, bandId, req.session.id)) {
                        const userIdTexte = req.params.userId;
                        const userId = parseInt(userIdTexte);

                        if (await bandModel.userExists(client, bandId, userId)) {
                            next();
                        } else {
                            res.status(404).json({error: [error.USER_NOT_FOUND_IN_BAND]});
                        }
                    } else {
                        res.status(403).json({error: [error.ACCESS_DENIED_IN_BAND]});
                    }
                } else {
                    res.status(404).json({error: [error.IDENTIFIED_USER_NOT_FOUND_IN_BAND]});
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        } else {
            res.status(403).json({error: [error.UNAUTHENTICATED]});
        }
    }
}

module.exports.canAnswerInvitation = async (req, res, next) => {
    //Groupe exists
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        if (req.session) {
            const bandIdTexte = req.params.bandId;
            const bandId = parseInt(bandIdTexte);
            const client = await pool.connect();

            try {
                if (await bandModel.bandExists(client, bandId)) {
                    if (await bandModel.userExists(client, bandId, req.session.id)) {
                        const {rows: status} = await bandModel.getStatus(client, bandId, req.session.id)
                        const userStatus = status[0].status;

                        if (userStatus === constant.STATUS_WAITING) {
                            next()
                        } else {
                            res.status(403).json({error: [error.STATUS_ALREADY_CHANGED_IN_BAND]});
                        }
                    } else {
                        res.status(404).json({error: [error.IDENTIFIED_USER_NOT_FOUND_IN_BAND]});
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
        } else {
            res.status(403).json({error: [error.UNAUTHENTICATED]});
        }
    }
}
