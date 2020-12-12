const userModel = require('../../model/userDB');
const pool = require("../../model/database");
const constant = require('../../utils/constant');
const error = require('../../error/index');
const { validationResult } = require('express-validator');

/**
 * @swagger
 * components:
 *  responses:
 *      MustBeManager:
 *          description: The current user must be manager
 *      Unauthenticated:
 *          description: The user is not authenticated
 */
module.exports.mustBeManager = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        if (req.session) {
            if (req.session.authLevel === constant.ROLE_ADMINISTRATOR || req.session.authLevel === constant.ROLE_MODERATOR) {
                next();
            } else {
                res.status(403).json({error: [error.ACCESS_DENIED]});
            }
        } else {
            res.status(401).json({error: [error.UNAUTHENTICATED]});
        }
    }
}
/**
 * @swagger
 * components:
 *  responses:
 *      MustBeManagerOrCreator:
 *          description: The current user must be manager or creator
 *      Unauthenticated:
 *          description: The user is not authenticated
 */
module.exports.mustBeManagerOrCreator = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        if (req.session) {
            const userIdTexte = req.params.userId;
            const userId = parseInt(userIdTexte);

            if (req.session.authLevel === constant.ROLE_ADMINISTRATOR || req.session.authLevel === constant.ROLE_MODERATOR || (userId === req.session.id)) {
                next();
            } else {
                res.status(403).json({error: [error.ACCESS_DENIED]});
            }
        } else {
            res.status(401).json({error: [error.UNAUTHENTICATED]});
        }
    }
}
/**
 * @swagger
 * components:
 *  responses:
 *      InputErrors:
 *          description: There is one or more input errors
 *      Unauthenticated:
 *          description: The user is not autenticated
 *      MustBeAdmin:
 *          description: The user must be administrator
 *      UserNotFound:
 *          description: Can't find the current user
 *      InternalServorError:
 *          description: Internal servor error
 */
module.exports.canChangeRole = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        if (!req.session) {
            res.status(401).json({error: [error.UNAUTHENTICATED]});
        } else {
            const {role} = req.body;
            const userIdTexte = req.params.userId;
            const userId = parseInt(userIdTexte);
            const client = await pool.connect();

            try {
                const {rows: userEntities} = await userModel.getUser(client, userId);
                const userEntity = userEntities[0];

                if (userEntity !== undefined) {
                    if (req.session.authLevel === constant.ROLE_CLIENT) {
                        res.status(403).json({error: [error.ACCESS_DENIED]});
                    } else {
                        if (req.session.authLevel === constant.ROLE_ADMINISTRATOR) {
                            next();
                        } else {
                            if (userEntity.role === constant.ROLE_ADMINISTRATOR || role.toUpperCase() === constant.ROLE_ADMINISTRATOR) {
                                res.status(403).json({error: [error.ACCESS_DENIED]});
                            } else {
                                next();
                            }
                        }
                    }
                } else {
                    res.status(404).json({error: [error.USER_NOT_FOUND]});
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

