const drinkModel = require("../model/drinkDB");
const userModel = require('../model/userDB');
const pool = require("../model/database");
const constant = require('../utils/constant');
const error = require('../error/index');

module.exports.mustBeManager = (req, res, next) => {
    if (req.session) {
        if (req.session.authLevel === constant.ROLE_ADMINISTRATOR || req.session.authLevel === constant.ROLE_MODERATOR) {
            next();
        } else {
            res.status(403).json({error: error.ACCESS_DENIED});
        }
    } else {
        res.status(401).json({error: error.UNAUTHENTICATED});
    }
}

module.exports.mustBeManagerOrCreator = (req, res, next) => {
    if (req.session) {
        const idTexte = req.params.id;
        const id = parseInt(idTexte);

        if (isNaN(id)) {
            res.status(400).json({error: error.INVALID_PARAMETER});
        } else {
            if (req.session.authLevel === constant.ROLE_ADMINISTRATOR || req.session.authLevel === constant.ROLE_MODERATOR || (id === req.session.id)) {
                next();
            } else {
                res.status(403).json({error: error.ACCESS_DENIED});
            }
        }
    } else {
        res.status(401).json({error: error.UNAUTHENTICATED});
    }
}

module.exports.canDelete = async (req, res, next) => {
    if (!req.session) {
        res.status(401).json({error: error.UNAUTHENTICATED});
    } else {
        const idTexte = req.params.id;
        const id = parseInt(idTexte);

        if (isNaN(id)) {
            res.status(400).json({error: error.INVALID_PARAMETER});
        } else {
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

module.exports.canChangeRole = async (req, res, next) => {
    if (!req.session) {
        res.status(401).json({error: error.UNAUTHENTICATED});
    } else {
        if (req.session.authLevel === constant.ROLE_CLIENT) {
            res.status(403).json({error: error.ACCESS_DENIED});
        } else {
            const {userId, role} = req.body;

            if (userId === undefined || role === undefined ||
                (role.toUpperCase() !== constant.ROLE_CLIENT && role.toUpperCase() !== constant.ROLE_MODERATOR && role.toUpperCase() !== constant.ROLE_ADMINISTRATOR)) {
                res.status(400).json({error: error.INVALID_PARAMETER});
            } else {
                if (req.session.authLevel === constant.ROLE_ADMINISTRATOR) {
                    next();
                } else {
                    const client = await pool.connect();

                    try {
                        const {rows: userEntities} = await userModel.getUser(client, userId);
                        const userEntity = userEntities[0];

                        if (userEntity !== undefined) {
                            if (userEntity.role === constant.ROLE_ADMINISTRATOR || role.toUpperCase() === constant.ROLE_ADMINISTRATOR) {
                                res.status(403).json({error: error.ACCESS_DENIED});
                            } else {
                                next();
                            }
                        } else {
                            res.status(404).json({error: error.USER_NOT_FOUND});
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
}
