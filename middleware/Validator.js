const UserModel = require('../modele/userDB');
const BandModel = require('../modele/bandDB');
const pool = require("../modele/database");
const Constants = require('../utils/constant');

module.exports.bandExists = async (req, res, next) => {
    if (req.session) {
        const bandIdTexte = req.params.bandId;
        const bandId = parseInt(bandIdTexte);
        const client = await pool.connect();

        if (isNaN(bandId)) {
            res.sendStatus(400);
        } else {
            try {
                if(await BandModel.bandExist(client, bandId)) {
                    next();
                } else {
                    res.sendStatus(404);
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.userExists = async (req, res, next) => {
    if (req.session) {
        const userIdTexte = req.params.userId;
        const userId = parseInt(userIdTexte);
        const client = await pool.connect();

        if (isNaN(userId)) {
            res.sendStatus(400);
        } else {
            try {
                if(await UserModel.userExist(client, userId)) {
                    next();
                } else {
                    res.sendStatus(404);
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        }
    } else {
        res.sendStatus(403);
    }
}
module.exports.authUserExistsInBand = async (req, res, next) => {
    if (req.session) {
        const bandIdTexte = req.params.bandId;
        const bandId = parseInt(bandIdTexte);
        const client = await pool.connect();

        if (isNaN(bandId)) {
            res.sendStatus(400);
        } else {
            try {
                if (await BandModel.userExist(client, bandId, req.session.id)) {
                    next();
                } else {
                    res.sendStatus(404);
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.userExistsInBand = async (req, res, next) => {
    if (req.session) {
        const bandIdTexte = req.params.bandId;
        const bandId = parseInt(bandIdTexte);
        const userIdTexte = req.params.userId;
        const userId = parseInt(userIdTexte);
        const client = await pool.connect();

        if (isNaN(bandId)) {
            res.sendStatus(400);
        } else {
            try {
                if (await BandModel.userExist(client, bandId, userId)) {
                    next();
                } else {
                    res.sendStatus(404);
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.authUserIsAdministratorInBand = async (req, res, next) => {
    if (req.session) {
        const bandIdTexte = req.params.bandId;
        const bandId = parseInt(bandIdTexte);
        const client = await pool.connect();

        if (isNaN(bandId)) {
            res.sendStatus(400);
        } else {
            try {
                if (await BandModel.isAdministratorInBand(client, bandId, req.session.id)) {
                    next();
                } else {
                    res.sendStatus(403);
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.roleIsValid = (req, res, next) => {
    if (req.session) {
        const {role} = req.body;

        if (role !== undefined && (role.toUpperCase() === Constants.ROLE_ADMINISTRATOR || role.toUpperCase() === Constants.ROLE_CLIENT)) {
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
}

// module.exports.canChangeRoleInBand = async (req, res, next) => {
//     if (!req.session || req.session.authLevel === Constants.ROLE_CLIENT) {
//         res.sendStatus(403);
//     } else {
//         next();
//     }
// }

module.exports.userIsNotInBand = async (req, res, next) => {
    if (req.session) {
        const bandIdTexte = req.params.bandId;
        const bandId = parseInt(bandIdTexte);
        const userIdTexte = req.params.userId;
        const userId = parseInt(userIdTexte);
        const client = await pool.connect();

        if (isNaN(bandId)) {
            res.sendStatus(400);
        } else {
            try {
                if (!await BandModel.userExist(client, bandId, userId)) {
                    next();
                } else {
                    res.sendStatus(409);
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.statusIsValid = (req, res, next) => {
    if (req.session) {
        const {status} = req.body;

        if (status !== undefined && (status.toUpperCase() === Constants.STATUS_ACCEPTED || status.toUpperCase() === Constants.STATUS_REJECTED)) {
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.hasAcceptedStatus = async (req, res, next) => {
    if (req.session) {
        const bandIdTexte = req.params.bandId;
        const bandId = parseInt(bandIdTexte);
        const client = await pool.connect();

        if (isNaN(bandId)) {
            res.sendStatus(400);
        } else {
            try {
                const status = await BandModel.getStatus(client, bandId, req.session.id)
                const userStatus = status.rows[0].status;
                if (userStatus === Constants.STATUS_ACCEPTED) {
                    next();
                } else {
                    res.sendStatus(403);
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.currentStatusIsWaiting = async (req, res, next) => {
    if (req.session) {
        const bandIdTexte = req.params.bandId;
        const bandId = parseInt(bandIdTexte);
        const client = await pool.connect();

        if (isNaN(bandId)) {
            res.sendStatus(400);
        } else {
            try {
                const status = await BandModel.getStatus(client, bandId, req.session.id)
                const userStatus = status.rows[0].status;
                if (userStatus === Constants.STATUS_WAITING) {
                    next();
                } else {
                    res.sendStatus(409);
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        }
    } else {
        res.sendStatus(403);
    }
}
