const bandModel = require('../../model/bandDB');
const pool = require("../../model/database");
const constant = require('../../utils/constant');
const error = require('../../error');

const bandController = require('../../controleur/bandDB');
const { body , param , check} = require('express-validator');

module.exports = {
    bandIdValidation : [
        param("bandId")
            .exists().withMessage("BandId is empty.")
            .toInt().not().isIn([null]).withMessage("BandId is not a number.")
            .isInt({min: 0}).withMessage("BandId is less than 0.")
            // .custom(value => {
            //     return bandController.bandExists(value).then(band => {
            //         if (!band) {
            //             return Promise.reject("Band does not exists.");
            //         }
            //     });
            // })
        ,
    ],
    createBandValidation : [
        body("label")
            .trim().not().isEmpty().withMessage("Label is empty.")
            .trim().isString().withMessage("Label is not a string."),
    ],
    roleValidation : [
        body("role")
            .isString().withMessage("Role is not a string.")
            .toUpperCase().isIn([constant.ROLE_CLIENT, constant.ROLE_ADMINISTRATOR]),
    ],
    statusValidation : [
        body("status")
            .isString().withMessage("Status is not a string.")
            .toUpperCase().isIn([constant.STATUS_ACCEPTED, constant.STATUS_REJECTED]),
    ]
};

// module.exports.bandExists = async (req, res, next) => {
//     const errors = validationResult(req);
//
//     if (!errors.isEmpty()) {
//         return res.status(400).json({error: errors.array()});
//     } else {
//         if (req.session) {
//             const bandIdTexte = req.params.bandId;
//             const bandId = parseInt(bandIdTexte);
//             const client = await pool.connect();
//
//             try {
//                 if (await bandModel.bandExists(client, bandId)) {
//                     next();
//                 } else {
//                     res.status(404).json({error: error.BAND_NOT_FOUND});
//                 }
//             } catch (error) {
//                 console.log(error);
//                 res.sendStatus(500);
//             } finally {
//                 client.release();
//             }
//         } else {
//             res.status(403).json({error: error.UNAUTHENTICATED});
//         }
//     }
// }

module.exports.authUserExistsInBand = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        if (req.session) {
            const bandIdTexte = req.params.bandId;
            const bandId = parseInt(bandIdTexte);
            const client = await pool.connect();

            try {
                if (await bandModel.userExists(client, bandId, req.session.id)) {
                    next();
                } else {
                    res.status(404).json({error: error.IDENTIFIED_USER_NOT_FOUND_IN_BAND});
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        } else {
            res.status(403).json({error: error.UNAUTHENTICATED});
        }
    }
}


module.exports.authUserIsAdministratorInBand = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        if (req.session) {
            const bandIdTexte = req.params.bandId;
            const bandId = parseInt(bandIdTexte);
            const client = await pool.connect();

            try {
                if (await bandModel.isAdministratorInBand(client, bandId, req.session.id)) {
                    next();
                } else {
                    res.status(403).json({error: error.ACCESS_DENIED_IN_BAND});
                }
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            } finally {
                client.release();
            }
        } else {
            res.status(403).json({error: error.UNAUTHENTICATED});
        }
    }
}

module.exports.hasAcceptedStatus = async (req, res, next) => {
    if (req.session) {
        const bandIdTexte = req.params.bandId;
        const bandId = parseInt(bandIdTexte);
        const client = await pool.connect();

        try {
            const {rows: status} = await bandModel.getStatus(client, bandId, req.session.id)
            const userStatus = status[0].status;

            if (userStatus === constant.STATUS_ACCEPTED) {
                next();
            } else {
                res.status(400).json({error: error.STATUS_NOT_ACCEPTED_IN_BAND});
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    } else {
        res.status(403).json({error: error.UNAUTHENTICATED});
    }
}


