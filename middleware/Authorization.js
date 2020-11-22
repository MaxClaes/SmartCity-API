const DrinkModele = require("../modele/drinkDB");
const pool = require("../modele/database");

module.exports.mustBeAdministrator = (req, res, next) => {
    if (req.session && req.session.authLevel === "ADMINISTRATOR") {
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.mustBeModerator = (req, res, next) => {
    if (req.session && req.session.authLevel === "MODERATOR") {
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.mustBeManager = (req, res, next) => {
    if (req.session) {
        if (req.session.authLevel === "ADMINISTRATOR" || req.session.authLevel === "MODERATOR") {
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
            if (req.session.authLevel === "ADMINISTRATOR" || req.session.authLevel === "MODERATOR" || (id === req.session.id)) {
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
                if (req.session.authLevel === "ADMINISTRATOR" || req.session.authLevel === "MODERATOR") {
                    next();
                } else {
                    const {rows: drinks} = await DrinkModele.getDrinkById(client, id);
                    const drink = drinks[0];

                    if(drink !== undefined){
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