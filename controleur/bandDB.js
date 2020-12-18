const bandModel = require("../model/bandDB");
const pool = require("../model/database");
const constant = require("../utils/constant");
const dto = require('../dto');
const error = require('../error/index');
const { validationResult } = require('express-validator');
const utils = require('../utils/utils');

module.exports.createBand = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {label} = req.body;
        const client = await pool.connect();

        try {
            client.query("BEGIN;");
            const {rows: bands} = await bandModel.createBand(client, label, new Date());
            const bandId = bands[0].band_id;

            if (bandId !== undefined) {
                await bandModel.addMember(client, req.session.id, bandId, null, constant.STATUS_ACCEPTED, constant.ROLE_ADMINISTRATOR, null)
                client.query("COMMIT;");
                res.status(201).json({id: bandId});
            } else {
                res.sendStatus(500);
            }
        } catch (error) {
            client.query("ROLLBACK;");
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.addMember = async (req, res) => {
    const bandIdTexte = req.params.bandId;
    const userIdTexte = req.params.userId;
    const bandId = parseInt(bandIdTexte);
    const userId = parseInt(userIdTexte);
    const client = await pool.connect();

    try {
        if (!await bandModel.userExists(client, bandId, userId)) {
            await bandModel.addMember(client, userId, bandId, new Date(), constant.STATUS_WAITING, constant.ROLE_CLIENT, req.session.id);
            res.sendStatus(201);
        } else {
            res.status(400).json({error: [error.USER_FOUND_IN_BAND]});
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getAllBands = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: bandsEntities} = await bandModel.getAllBands(client);
        const bandEntity = bandsEntities[0];

        if(bandEntity !== undefined) {
            const bands = [];
            bandsEntities.forEach(function(b) {
                bands.push(dto.bandClientDTO(b));
            });
            res.json(bands);
        } else {
            res.status(404).json({error: [error.BAND_NOT_FOUND]});
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getAllMembers = async (req, res) => {
    const bandIdTexte = req.params.bandId;
    const bandId = parseInt(bandIdTexte);
    const client = await pool.connect();

    try {
        const {rows: membersEntities} = await bandModel.getAllMembers(client, bandId);

        if (membersEntities[0] !== undefined) {
            const members = [];

            membersEntities.forEach(function(m) {
                members.push({
                    id: m.client_id,
                    name: m.name,
                    firstname: m.firstname,
                    invitationDate: m.invitation_date,
                    status: m.status,
                    role: m.role,
                    invitedBy: m.invited_by
                });
            });
            res.json(members);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.deleteBand = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const bandIdTexte = req.params.bandId;
        const bandId = parseInt(bandIdTexte);

        const client = await pool.connect();

        try {
            client.query("BEGIN;");
            await bandModel.deleteAllMemberOfBand(client, bandId);
            await bandModel.deleteBand(client, bandId);
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
    const userIdTexte = req.params.userId;
    const bandId = parseInt(bandIdTexte);
    const userId = parseInt(userIdTexte);
    const client = await pool.connect();

    try {
        client.query("BEGIN;");
        await bandModel.deleteMember(client, bandId, userId);

        if (await bandModel.bandIsEmpty(client, bandId)) {
            await bandModel.deleteBand(client, bandId);
        } else {
            if (!await bandModel.administratorExistsInBand(client, bandId)) {
                const {rows: users} = await bandModel.getFirstUserIdWithStatusAccepted(client, bandId);
                const userIdWithStatusAccepted = users[0].id

                if (userIdWithStatusAccepted !== undefined) {
                    //On lui assigne le rôle administrator
                    await bandModel.changeRole(client, bandId, userIdWithStatusAccepted, constant.ROLE_ADMINISTRATOR);
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

module.exports.leaveBand = async (req, res) => {
    const bandIdTexte = req.params.bandId;
    const bandId = parseInt(bandIdTexte);
    const client = await pool.connect();

    try {
        client.query("BEGIN;");
        await bandModel.deleteMember(client, bandId, req.session.id);

        if (await bandModel.bandIsEmpty(client, bandId)) {
            await bandModel.deleteBand(client, bandId);
        } else {
            if (!await bandModel.administratorExistsInBand(client, bandId)) {
                const {rows: users} = await bandModel.getFirstUserIdWithStatusAccepted(client, bandId);

                if (users[0] !== undefined) {
                    //On lui assigne le rôle administrator
                    const userIdWithStatusAccepted = users[0].id
                    await bandModel.changeRole(client, bandId, userIdWithStatusAccepted, constant.ROLE_ADMINISTRATOR);
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

module.exports.getBandById = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const bandIdTexte = req.params.bandId;
        const bandId = parseInt(bandIdTexte);
        const client = await pool.connect();

        try {
            if (await bandModel.userExists(client, bandId, req.session.id)) {
                const {rows: bandsEntities} = await bandModel.getBandById(client, bandId);
                const bandEntity = bandsEntities[0];

                if (bandEntity !== undefined) {
                    res.json(dto.bandClientDTO(bandEntity));
                } else {
                    res.status(404).json({error: [error.BAND_NOT_FOUND]});
                }
            } else {
                res.status(404).json({error: [error.IDENTIFIED_USER_NOT_FOUND_IN_BAND]});
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getBandsByUserId = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const userIdtexte = req.params.userId;
        const userId = parseInt(userIdtexte);
        const client = await pool.connect();

        try {
            const {rows: bandsEntities} = await bandModel.getBandsByUserId(client, userId);

            if(bandsEntities[0] !== undefined) {
                const bands = [];
                bandsEntities.forEach(function(b) {
                    bands.push(dto.bandClientDTO(b));
                });
                res.json(bands);
            } else {
                res.status(404).json({error: [error.BAND_NOT_FOUND]});
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getMyBands = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: bandsEntities} = await bandModel.getBandsByUserId(client, req.session.id);
        const bandEntity = bandsEntities[0];

        if (bandEntity !== undefined) {
            const bandsAccepted = [];
            bandsEntities.forEach(function(b) {
                if (b.status === constant.STATUS_ACCEPTED || b.status === null) {
                    bandsAccepted.push(dto.bandClientDTO(b));
                }
            });
            res.json(bandsAccepted);
        } else {
            res.json([]);
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
        await bandModel.changeRole(client, bandId, userId, role);
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
        const {rows: invitationsEntities} = await bandModel.getAllInvitations(client, req.session.id);
        const invitationEntity = invitationsEntities[0];

        if (invitationEntity !== undefined) {
            const invitations = [];
            invitationsEntities.forEach(function(i) {
                invitations.push(dto.bandClientDTO(i));
            });
            res.json(invitations);
        } else {
            res.json([]);
            // res.status(404).json({error: [error.BAND_INVITATIONS_NOT_FOUND]});
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

        if (status === constant.STATUS_ACCEPTED) {
            await bandModel.changeStatus(client, bandId, req.session.id, constant.STATUS_ACCEPTED);

            if (!await bandModel.administratorExistsInBand(client, bandId)) {
                await bandModel.changeRole(client, bandId, req.session.id, constant.ROLE_ADMINISTRATOR);
            }
        } else {
            await bandModel.deleteMember(client, bandId, req.session.id);
            //Si on veut garder une trace que l'utilisateur a refusé la demande on peut mettre la ligne suivante
            //Cela implique des changements dans les conditions de suppression d'un groupe
            //Il faudrait ajouter qu'on peut supprimer un groupe s'il est vide ou si tous les status restants sont à 'R'
            //await bandModel.changeStatus(client, bandId, req.session.id, constant.STATUS_REJECTED);
            if (await bandModel.bandIsEmpty(client, bandId)) {
                await bandModel.deleteBand(client, bandId);
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

module.exports.bandExists = async (id) => {
    const client = await pool.connect();

    try {
        return await bandModel.bandExists(client, id);
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}
