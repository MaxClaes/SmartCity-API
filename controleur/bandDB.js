const BandModel = require("../model/bandDB");
const pool = require("../model/database");
const Constants = require("../utils/constant");
const DTO = require('../dto/dto');

module.exports.createBand = async (req, res) => {
    const {label} = req.body;
    const client = await pool.connect();

    try {
        const date = new Date();

        client.query("BEGIN;");
        const {rows: bands} = await BandModel.createBand(client, label, date);
        const bandId = bands[0].id;

        if (bandId !== undefined && bandId !== null) {
            await BandModel.addMember(client, req.session.id, bandId, null, Constants.STATUS_ACCEPTED, Constants.ROLE_ADMINISTRATOR, null)
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
        await BandModel.addMember(client, userId, bandId, new Date(), Constants.STATUS_WAITING, Constants.ROLE_CLIENT, req.session.id);
        res.sendStatus(201);
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
        const {rows: bandsEntities} = await BandModel.getAllBands(client);
        const bandEntity = bandsEntities[0];

        if(bandEntity !== undefined) {
            const bands = [];
            bandsEntities.forEach(function(b) {
                bands.push(DTO.bandClientDTO(b));
            });
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
                    const {rows: users} = await BandModel.getFirstUserIdWithStatusAccepted(client, bandId);
                    const userIdWithStatusAccepted = users[0].id

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
            const {rows: bandsEntities} = await BandModel.getBandById(client, bandId);
            const bandEntity = bandsEntities[0];

            if (bandEntity !== undefined){
                res.json(DTO.bandClientDTO(bandEntity));
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
        const {rows: bandsEntities} = await BandModel.getBandsByUserId(client, req.session.id);
        const bandEntity = bandsEntities[0];

        if (bandEntity !== undefined) {
            //const bandsAccepted = bandsEntities.filter(band => band.status === Constants.STATUS_ACCEPTED || band.status === null);
            const bandsAccepted = [];
            bandsEntities.forEach(function(b) {
                if (b.status === Constants.STATUS_ACCEPTED || b.status === null) {
                    bandsAccepted.push(DTO.bandClientDTO(b));
                }
            });
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
        const {rows: invitationsEntities} = await BandModel.getAllInvitations(client, req.session.id);
        const invitationEntity = invitationsEntities[0];

        if (invitationEntity !== undefined) {
            const invitations = [];
            invitationsEntities.forEach(function(i) {
                invitations.push(DTO.bandClientDTO(i));
            });
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
            await BandModel.deleteMember(client, bandId, req.session.id);
            //Si on veut garder une trace que l'utilisateur a refusé la demande on peut mettre la ligne suivante
            //Cela implique des changements dans les conditions de suppression d'un groupe
            //Il faudrait ajouter qu'on peut supprimer un groupe s'il est vide ou si tous les status restants sont à 'R'
            //await BandModel.changeStatus(client, bandId, req.session.id, Constants.STATUS_REJECTED);
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
