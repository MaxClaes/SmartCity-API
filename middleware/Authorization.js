const DrinkModele = require("../modele/drinkDB");
const UserModele = require('../modele/userDB');
const pool = require("../modele/database");
const Constants = require('../utils/constant');

module.exports.mustBeAdministrator = (req, res, next) => {
    if (req.session && req.session.authLevel === Constants.ROLE_ADMINISTRATOR) {
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.mustBeModerator = (req, res, next) => {
    if (req.session && req.session.authLevel === Constants.ROLE_MODERATOR) {
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.mustBeManager = (req, res, next) => {
    if (req.session) {
        if (req.session.authLevel === Constants.ROLE_ADMINISTRATOR || req.session.authLevel === Constants.ROLE_MODERATOR) {
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.mustBeCreator = (req, res, next) => {
    if (req.session) {
        const {userId} = req.body;
        const clientObj = req.session;

        if (userId !== undefined && userId === clientObj.id) {
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.mustBeManagerOrCreator = (req, res, next) => {
    if (req.session) {
        const idTexte = req.params.id;
        const id = parseInt(idTexte);

        if (isNaN(id)) {
            res.sendStatus(400);
        } else {
            if (req.session.authLevel === Constants.ROLE_ADMINISTRATOR || req.session.authLevel === Constants.ROLE_MODERATOR || (id === req.session.id)) {
                next();
            } else {
                res.sendStatus(403);
            }
        }
    } else {
        res.sendStatus(403);    //401 plutôt ??
    }
}

module.exports.canDelete = async (req, res, next) => {
    if (req.session) {
        const idTexte = req.params.id;
        const id = parseInt(idTexte);
        const client = await pool.connect();

        try {
            if (isNaN(id)) {
                res.sendStatus(400);
            } else {
                if (req.session.authLevel === Constants.ROLE_ADMINISTRATOR || req.session.authLevel === Constants.ROLE_MODERATOR) {
                    next();
                } else {
                    const {rows: drinks} = await DrinkModele.getDrinkById(client, id);
                    const drink = drinks[0];

                    if(drink !== undefined) {
                        if (parseInt(drink.created_by) === req.session.id) {
                            next();
                        } else {
                            res.sendStatus(403);
                        }
                    } else {
                        res.sendStatus(404);
                    }
                }
            }
        } catch (error){
            res.sendStatus(500);
        } finally {
            client.release();
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.canChangeRole = async (req, res, next) => {
    if (req.session && req.session.authLevel !== Constants.ROLE_CLIENT) {
        const {targetIdUser, newRole} = req.body;
        const client = await pool.connect();

        try {
            if (targetIdUser === undefined || newRole === undefined ||
                (newRole.toUpperCase() !== Constants.ROLE_CLIENT && newRole.toUpperCase() !== Constants.ROLE_MODERATOR && newRole.toUpperCase() !== Constants.ROLE_ADMINISTRATOR)) {
                res.sendStatus(400);
            } else {
                const {rows: targetUsers} = await UserModele.getUser(client, targetIdUser);
                const targetUserRole = targetUsers[0].role;

                if (targetUserRole !== undefined) {
                    if (req.session.authLevel === Constants.ROLE_ADMINISTRATOR ||
                        req.session.authLevel === Constants.ROLE_MODERATOR && targetUserRole === Constants.ROLE_MODERATOR ||
                        req.session.authLevel === Constants.ROLE_MODERATOR && targetUserRole === Constants.ROLE_CLIENT ||
                        req.session.authLevel === Constants.ROLE_MODERATOR && newRole.toUpperCase() !== Constants.ROLE_ADMINISTRATOR) {
                            next();
                    } else {
                        res.sendStatus(403);
                    }
                    // if (Constants.AUTH_LEVEL.indexOf(Constants.AUTH_LEVEL.find(req.session.authLevel)) >=
                    //     Constants.AUTH_LEVEL.indexOf(Constants.AUTH_LEVEL.find(targetUserRole)) &&
                    //     Constants.AUTH_LEVEL.indexOf(Constants.AUTH_LEVEL.find(req.session.authLevel)) >=
                    //     Constants.AUTH_LEVEL.indexOf(Constants.AUTH_LEVEL.find(newRole))) {
                    //     next();
                    // } else {
                    //     res.sendStatus(403);
                    // }
                } else {
                    res.sendStatus(404);
                }
            }
        } catch (error){
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    } else {
        res.sendStatus(403);
    }
}
