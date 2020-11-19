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
    console.log(req.session.authLevel);
    if (req.session && (req.session.authLevel === "ADMINISTRATOR" || req.session.authLevel === "MODERATOR")) {
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.mustBeCreator = (req, res, next) => {
    if (req.session) {
        const {label, prcAlcool, quantite, id} = req.body;
        const clientObj = req.session;
        console.log(id);
        console.log(clientObj.id);
        if (id === undefined) {
            console.log("true");
        }
        if (id !== undefined && id === clientObj.id) {
            console.log("ici");
            next();
        } else {
            console.log("error");
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.mustBeManagerOrCreator = (req, res, next) => {
    if (req.session && (this.mustBeManager(req, res, next) || this.mustBeCreator(req, res, next))) {
        console.log("mustBeManagerOrCreator");
        next();
    } else {
        res.sendStatus(403);
    }
}
