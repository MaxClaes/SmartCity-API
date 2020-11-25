const DrinkModel = require("../modele/drinkDB");
const UserModel = require('../modele/userDB');
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
                    const {rows: drinks} = await DrinkModel.getDrinkById(client, id);
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
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.canChangeRole = async (req, res, next) => {
    if (!req.session && req.session.authLevel === Constants.ROLE_CLIENT) {
        res.sendStatus(403);
    } else {
        const {targetUserId, targetNewRole} = req.body;
        const client = await pool.connect();

        try {
            if (targetUserId === undefined || targetNewRole === undefined ||
                (targetNewRole.toUpperCase() !== Constants.ROLE_CLIENT && targetNewRole.toUpperCase() !== Constants.ROLE_MODERATOR && targetNewRole.toUpperCase() !== Constants.ROLE_ADMINISTRATOR)) {
                res.sendStatus(400);
            } else {
                if (req.session.authLevel === Constants.ROLE_ADMINISTRATOR) {
                    next();
                } else {
                    const {rows: targetUsers} = await UserModel.getUser(client, targetUserId);
                    const targetUser = targetUsers[0];

                    if (targetUser !== undefined) {
                        if (targetUser.role === Constants.ROLE_ADMINISTRATOR || targetNewRole.toUpperCase() === Constants.ROLE_ADMINISTRATOR) {
                            res.sendStatus(403);
                        } else {
                            next();
                        }
                    } else {
                        res.sendStatus(404);
                    }
                }
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

// module.exports.canSeeBandById = async (req, res, next) => {
//     if (req.session) {
//         if (req.session.authLevel === Constants.ROLE_ADMINISTRATOR || req.session.authLevel === Constants.ROLE_MODERATOR) {
//             next();
//         } else {
//             const idBandTexte = req.params.id;
//             const idBand = parseInt(idBandTexte);
//
//             if (isNaN(id)) {
//                 res.sendStatus(400);
//             } else {
//                 const client = await pool.connect();
//                 try {
//                     const {rows: bands} = await BandModel.getBandByUserId(client, req.session.id, idBandTexte);
//                     const band = bands[0];
//
//                     if (band !== undefined) {
//                         next();
//                     } else {
//                         res.sendStatus(403);
//                     }
//                 } catch (error){
//                     res.sendStatus(500);
//                 } finally {
//                     client.release();
//                 }
//             }
//         }
//     } else {
//         res.sendStatus(401);
//     }
// }
