const BandModel = require("../modele/bandDB");
const pool = require("../modele/database");
const Constants = require("../utils/constant");

module.exports.createBand = async (req, res) => {
    const {label} = req.body;
    const client = await pool.connect();

    try {
        client.query("BEGIN;");
        const bands = await BandModel.createBand(client, label, new Date());
        const bandId = bands.rows[0].id;

        if (bandId !== undefined && bandId !== null) {
            await BandModel.addMember(client, req.session.id, bandId, new Date(), null, Constants.ROLE_ADMINISTRATOR)
            client.query("COMMIT;");
            res.sendStatus(201);
        } else {
            res.sendStatus(404);
        }
    } catch (error){
        client.query("ROLLBACK;");
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.addMember = async (req, res) => {
    const bandIdTexte = req.params.bandId;
    const bandId = parseInt(bandIdTexte);
    const userIdTexte = req.params.userId;
    const userId = parseInt(userIdTexte);
    const client = await pool.connect();

    try {
        await BandModel.addMember(client, userId, bandId, new Date(), Constants.STATUS_WAITING, Constants.ROLE_CLIENT);
        res.sendStatus(204);
    } catch (error){
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getAllBands = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: bands} = await BandModel.getAllBands(client);
        const band = bands[0];

        if(band !== undefined){
            res.json(bands);
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

// module.exports.getDrinksByName = async (req, res) => {
//     const label = req.params.label;
//     const labelWithoutSpace = label.trim();
//     const client = await pool.connect();
//
//     try {
//         const {rows: drinks} = await DrinkModele.getDrinksByName(client, labelWithoutSpace);
//         const drink = drinks[0];
//
//         if(drink !== undefined){
//             res.json(drinks);
//         } else {
//             res.sendStatus(404);
//         }
//     } catch (error){
//         res.sendStatus(500);
//     } finally {
//         client.release();
//     }
// }
//
// module.exports.getDrinksByCreatedBy = async (req, res) => {
//     const idTexte = req.params.id;
//     const createdBy = parseInt(idTexte);
//     const client = await pool.connect();
//
//     try {
//         if (isNaN(createdBy)) {
//             res.sendStatus(400);
//         } else {
//             const {rows: drinks} = await DrinkModele.getDrinksByCreatedBy(client, createdBy);
//             const drink = drinks[0];
//
//             if (drink !== undefined) {
//                 res.json(drinks);
//             } else {
//                 res.sendStatus(404);
//             }
//         }
//     } catch (error){
//         res.sendStatus(500);
//     } finally {
//         client.release();
//     }
// }
//
module.exports.deleteBand = async (req, res) => {
    const bandIdTexte = req.params.bandId;
    const bandId = parseInt(bandIdTexte);
    const client = await pool.connect();

    if (isNaN(bandId)) {
        res.sendStatus(400);
    } else {
        try {
            client.query("BEGIN;");
            await BandModel.deleteAllMemberOfBand(client, bandId);
            await BandModel.deleteBand(client, bandId);
            client.query("COMMIT;");
            res.sendStatus(204);
        } catch (error) {
            client.query("ROLLBACK;");
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.deleteMember = async (req, res) => {
    const bandIdTexte = req.params.bandId;
    const bandId = parseInt(bandIdTexte);
    const userIdTexte = req.params.userId;
    const userId = parseInt(userIdTexte);
    const client = await pool.connect();

    if (isNaN(bandId)) {
        res.sendStatus(400);
    } else {
        try {
            client.query("BEGIN;");
            await BandModel.deleteMember(client, bandId, isNaN(userId) ? req.session.id : userId);

            if (await BandModel.bandIsEmpty(client, bandId)) {
                await BandModel.deleteBand(client, bandId);
            } else {
                if (!await BandModel.administratorExistsInBand(client, bandId)) {
                    const userIdWithStatusAccepted = await BandModel.getFirstUserIdWithStatusAccepted(client, bandId);

                    if (userIdWithStatusAccepted !== undefined) {
                        //On lui assigne le rôle administrator
                        await BandModel.changeRole(client, bandId, userIdWithStatusAccepted, Constants.ROLE_ADMINISTRATOR);
                    }
                    //Si pas de user avec status accepted
                    //Alors on ne fait rien et on assignera le role admin lors de l'acceptation d'une invitation
                }
            }

            client.query("COMMIT;");
            res.sendStatus(204);
        } catch (error) {
            client.query("ROLLBACK;");
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getBandById = async (req, res) => {
    const bandIdTexte = req.params.bandId;
    const bandId = parseInt(bandIdTexte);
    const client = await pool.connect();

    if(isNaN(bandId)){
        res.sendStatus(400);
    } else {
        try {
            const {rows: bands} = await BandModel.getBandById(client, bandId);
            const band = bands[0];

            if (band !== undefined){
                res.json(band);
            } else {
                res.sendStatus(404);
            }
        } catch (error){
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getBandsByUserId = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: bands} = await BandModel.getBandsByUserId(client, req.session.id);
        const band = bands[0];

        if (band !== undefined) {
            const bandsAccepted = bands.filter(band => band.status === Constants.STATUS_ACCEPTED);
            res.json(bandsAccepted);
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

module.exports.changeRole = async (req, res) => {
    const bandIdTexte = req.params.bandId;
    const bandId = parseInt(bandIdTexte);
    const userIdTexte = req.params.userId;
    const userId = parseInt(userIdTexte);
    const {role} = req.body;

    const client = await pool.connect();

    try {
        await BandModel.changeRole(client, bandId, userId, role);
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getAllInvitations = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: invitations} = await BandModel.getAllInvitations(client, req.session.id);
        const invitation = invitations[0];

        if (invitation !== undefined){
            res.json(invitations);
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

module.exports.responseInvitation = async (req, res) => {
    const bandIdTexte = req.params.bandId;
    const bandId = parseInt(bandIdTexte);
    const {status} = req.body;
    const client = await pool.connect();

    try {
        client.query("BEGIN;");

        if (status === Constants.STATUS_ACCEPTED) {
            await BandModel.changeStatus(client, bandId, req.session.id, Constants.STATUS_ACCEPTED);

            if (!await BandModel.administratorExistsInBand(client, bandId)) {
                await BandModel.changeRole(client, bandId, req.session.id, Constants.ROLE_ADMINISTRATOR);
            }
        } else {
            await BandModel.changeStatus(client, bandId, req.session.id, Constants.STATUS_REJECTED);

            if (await BandModel.bandIsEmpty(client, bandId)) {
                await BandModel.deleteBand(client, bandId);
            }
        }
        client.query("COMMIT;");
        res.sendStatus(204);
    } catch (error) {
        client.query("ROLLBACK;");
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}
