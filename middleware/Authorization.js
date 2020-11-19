module.exports.mustBeManager = (req, res, next) => {
    if (req.session && req.session.authLevel === "manager") {
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports.mustBeCreator = (req, res, next) => {
    if (req.session) {
        const {label, prcAlcool, quantite, id} = req.body;
        const clientObj = req.session;

        if (id === clientObj.id) {
            next();
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports.mustBeManagerOrCreator = (req, res, next) => {
    if (req.session && (this.mustBeManager(req, res, next) || this.mustBeCreator(req, res, next))) {
        next();
    } else {
        res.sendStatus(403);
    }
}
