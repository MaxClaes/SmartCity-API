module.exports.createBand = async (client, label, creationDate) => {
    return await client.query(`
        INSERT INTO band(label, creation_date)
        VALUES ($1, $2) SET @LASTID = SCOPE_IDENTITY()
        `, [label, creationDate]
    );
};

module.exports.addMember = async (client, clientId, bandId, creationDate, status, role) => {
    return await client.query(`
        INSERT INTO band_client(client_id, band_id, creation_date, status, role)
        VALUES ($1, $2, $3, $4, $5)
        `, [clientId, bandId, creationDate, status, role]
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
    return await client.query(`SELECT * FROM band;`);
}

// module.exports.getDrinksByName = async (client, label) => {
//     const labelUpperCase = label.toUpperCase();
//
//     return await client.query(`
//         SELECT * FROM drink WHERE UPPER(label) = $1;
//         `, [labelUpperCase]
//     );
// };
//
// module.exports.getDrinksByCreatedBy = async (client, createdBy) => {
//     return await client.query(`
//         SELECT * FROM drink WHERE created_by = $1;
//         `, [createdBy]
//     );
// };
//
// module.exports.deleteDrink = async (client, id) => {
//     return await client.query(`
//         DELETE from drink WHERE id = $1;
//         `, [id]
//     );
// }

module.exports.getBandById = async (client, bandId) => {
    return await client.query(`
        SELECT band_client.client_id, band_client.band_id, band_client.creation_date, band_client.status, band_client.role, 
        band.id, band.creation_date, band.label 
        FROM band_client INNER JOIN band on band_client.band_id = band.id WHERE band.id = $1;
        `, [bandId]
    );
}

module.exports.getBandsByUserId = async (client, userId) => {
    return await client.query(`
        SELECT band_client.client_id, band_client.band_id, band_client.creation_date, band_client.status, band_client.role, 
        band.id, band.creation_date, band.label 
        FROM band_client INNER JOIN band on band_client.band_id = band.id WHERE client_id = $1;
        `, [userId]
    );
}
