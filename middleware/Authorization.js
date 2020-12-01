const constant = require('../utils/constant');
const error = require('../error/index');
const { validationResult } = require('express-validator');

module.exports.mustBeManager = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
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
}

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
                res.status(403).json({error: error.ACCESS_DENIED});
            }
        } else {
            res.status(401).json({error: error.UNAUTHENTICATED});
        }
    }
}
