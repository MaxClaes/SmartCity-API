const Constants = require("../utils/constant");

module.exports.createBand = async (client, label, creationDate) => {
    return await client.query(`
        INSERT INTO band(label, creation_date)
        VALUES ($1, $2) RETURNING id;
        `, [label, creationDate]
    );
};

module.exports.addMember = async (client, userId, bandId, creationDate, status, role, invited_by) => {
    return await client.query(`
        INSERT INTO band_client(client_id, band_id, creation_date, status, role, invited_by)
        VALUES ($1, $2, $3, $4, $5, $6);
        `, [userId, bandId, creationDate, status, role, invited_by]
    );
};

//
// /*
//  On ne permet pas de passer nbSignalement car ce sera trop risqué qu'un utilisateur puisse modifier cette variable comme il le souhaite
//  */
// module.exports.updateDrink = async (client, label, prcAlcohol, quantity, id) => {
//     return await client.query(`
//         UPDATE drink SET label = $1, prc_alcohol = $2, quantity = $3
//         WHERE id = $4;
//         `, [label, prcAlcohol, quantity, id]
//     );
// };

module.exports.getAllBands = async (client) => {
    return await client.query(`SELECT * FROM band_client;`);    //A changer le band_client
}

module.exports.deleteAllMemberOfBand = async (client, bandId) => {
    return await client.query(`
        DELETE FROM band_client WHERE band_id = $1;
        `, [bandId]
    );
}

module.exports.deleteBand = async (client, bandId) => {
    return await client.query(`
        DELETE FROM band WHERE id = $1;
        `, [bandId]
    );
}

module.exports.deleteMember = async (client, bandId, memberId) => {
    return await client.query(`
        DELETE from band_client WHERE band_id = $1 AND client_id = $2;
        `, [bandId, memberId]
    );
}

module.exports.getBandById = async (client, bandId) => {
    // return await client.query(`
    //     SELECT * from band WHERE id = $1`, [bandId]
    // );
    return await client.query(`
        SELECT band.id, band.label, band.creation_date as bandCreationDate, band_client.client_id as userId, 
        band_client.creation_date as dateOfInvitation, band_client.status, band_client.role, band_client.invited_by
        FROM band_client INNER JOIN band on band_client.band_id = band.id WHERE band_client.band_id = $1;
        `, [bandId]
    );
}

module.exports.getBandsByUserId = async (client, userId) => {
    return await client.query(`
        SELECT band.id, band.label, band.creation_date as bandCreationDate, band_client.creation_date as dateOfInvitation, 
        band_client.status, band_client.role, band_client.invited_by FROM band_client INNER JOIN band on band_client.band_id = band.id WHERE band_client.client_id = $1;
        `, [userId]
    );
}

module.exports.bandExist = async (client, bandId) => {
    const {rows} = await client.query(
        "SELECT count(band_id) AS nbr FROM band_client WHERE band_id = $1",
        [bandId]
    );
    return rows[0].nbr > 0;
};

module.exports.userExist = async (client, bandId, clientId) => {
    const {rows} = await client.query(
        "SELECT count(client_id) AS nbr FROM band_client WHERE band_id = $1 AND client_id = $2",
        [bandId, clientId]
    );
    return rows[0].nbr > 0;
};

module.exports.bandIsEmpty = async (client, bandId) => {
    const {rows} = await client.query(
        "SELECT count(band_id) AS nbr FROM band_client WHERE band_id = $1",
        [bandId]
    );
    return rows[0].nbr == 0;
};

module.exports.isAdministratorInBand = async (client, bandId, clientId) => {
    const {rows} = await client.query(
        "SELECT count(client_id) AS nbr FROM band_client WHERE band_id = $1 AND client_id = $2 AND role = $3",
        [bandId, clientId, Constants.ROLE_ADMINISTRATOR]
    );
    return rows[0].nbr > 0;
};

module.exports.administratorExistsInBand = async (client, bandId) => {
    const {rows} = await client.query(
        "SELECT count(client_id) AS nbr FROM band_client WHERE band_id = $1 AND role = $2",
        [bandId, Constants.ROLE_ADMINISTRATOR]
    );
    return rows[0].nbr > 0;
};

module.exports.getFirstUserIdWithStatusAccepted = async (client, bandId) => {
    return await client.query(
        "SELECT band_client.client_id DISTINCT band_client.band_id FROM band_client WHERE band_id = $1 AND status = $2;",
        [bandId, Constants.STATUS_ACCEPTED]
    );
};

module.exports.changeRole = async (client, bandId, userId, role) => {
    return await client.query(`UPDATE band_client SET role = $1 WHERE client_id = $2 AND band_id = $3;`, [role, userId, bandId]);
};

module.exports.getAllInvitations = async (client, userId) => {
    return await client.query(`SELECT band.id, band.label, band.creation_date as bandCreationDate, 
    band_client.creation_date as dateOfInvitation, band_client.status, band_client.role, band_client.invited_by 
    FROM band_client INNER JOIN band on band_client.band_id = band.id WHERE client_id = $1 AND status = $2;`, [userId, Constants.STATUS_WAITING]);
};

module.exports.changeStatus = async (client, bandId, userId, status) => {
    return await client.query(`UPDATE band_client SET status = $1 WHERE client_id = $2 AND band_id = $3;`, [status, userId, bandId]);
};

module.exports.getStatus = async (client, bandId, userId) => {
    return await client.query(`SELECT band_client.status FROM band_client WHERE client_id = $1 AND band_id = $2;`, [userId, bandId]);
}
