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
        const {userId} = req.body;
        const clientObj = req.session;

        if (req.session.authLevel === "ADMINISTRATOR" || req.session.authLevel === "MODERATOR" || (userId !== undefined && userId === clientObj.id)) {
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }


    // if (req.session) {
    //     if (req.session.authLevel === "ADMINISTRATOR" || req.session.authLevel === "MODERATOR") {
    //         next();
    //     } else if (this.mustBeCreator(req, res, next)) {
    //         next();
    //     } else {
    //         res.sendStatus(403);
    //     }
    // } else {
    //     res.sendStatus(403);
    // }

    // if (req.session) {
    //     if (this.mustBeManager(req, res) || this.mustBeCreator(req, res)) {
    //         console.log("manager ou createur");
    //         next();
    //     } else {
    //         console.log("ni modo ni createur");
    //         res.sendStatus(403);
    //     }
    // } else {
    //     res.sendStatus(403);
    // }

    // if (req.session) {
    //     if (this.mustBeManager(req, res, next)) {
    //         console.log("salut");
    //     } else if (this.mustBeCreator(req, res, next)) {
    //         console.log("coucou");
    //     } else {
    //         res.sendStatus(403);
    //     }
    // } else {
    //     res.sendStatus(403);
    // }

}
