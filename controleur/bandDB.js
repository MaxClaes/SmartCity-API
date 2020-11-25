const BandModel = require("../modele/bandDB");
const pool = require("../modele/database");
const Constants = require("../utils/constant");

module.exports.createBand = async (req, res) => {
    const {label} = req.body;
    const client = await pool.connect();

    try {
        client.query("BEGIN;");
        const bandId = await BandModel.createBand(client, label, new Date());
        await BandModel.addMember(client, req.session.id, bandId, null, null, Constants.ROLE_ADMINISTRATOR)
        client.query("COMMIT;");
        res.sendStatus(201);
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
        await BandModel.addMember(client, userId, bandId, new Date(), Constants.STATUS_WAITING, Constants.ROLE_NONE);
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
            res.json(band);
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
            await BandModel.deleteBand(client, bandId);
            res.sendStatus(204);
        } catch (error){
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

    if (isNaN(bandId) || isNaN(userId)) {
        res.sendStatus(400);
    } else {
        try {
            await BandModel.deleteMember(client, bandId, userId);
            res.sendStatus(204);
        } catch (error){
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

    if(isNaN(id)){
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
