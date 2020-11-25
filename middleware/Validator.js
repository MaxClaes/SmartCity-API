const UserModel = require('../modele/userDB');
const BandModel = require('../modele/bandDB');
const pool = require("../modele/database");

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
