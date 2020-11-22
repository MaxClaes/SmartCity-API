module.exports.createDrink = async (client, label, prcAlcohol, quantity, created_by) => {
    const nbReportsInitial = 0;

    return await client.query(`
        INSERT INTO drink(label, prc_alcohol, quantity, created_by, nb_reports) 
        VALUES ($1, $2, $3, $4, $5);
        `, [label, prcAlcohol, quantity, created_by, nbReportsInitial]
    );
};

/*
 On ne permet pas de passer nbSignalement car ce sera trop risqué qu'un utilisateur puisse modifier cette variable comme il le souhaite
 */
module.exports.updateDrink = async (client, label, prcAlcohol, quantity, id) => {
     return await client.query(`
        UPDATE drink SET label = $1, prc_alcohol = $2, quantity = $3
        WHERE id = $4;
        `, [label, prcAlcohol, quantity, id]
     );
};

module.exports.getAllDrinks = async (client) => {
    return await client.query(`SELECT * FROM drink;`);
}

module.exports.getDrinksByName = async (client, label) => {
    const labelUpperCase = label.toUpperCase();

    return await client.query(`
        SELECT * FROM drink WHERE UPPER(label) = $1;
        `, [labelUpperCase]
    );
};

module.exports.getDrinksByCreatedBy = async (client, createdBy) => {
    return await client.query(`
        SELECT * FROM drink WHERE created_by = $1;
        `, [createdBy]
    );
};

module.exports.deleteDrink = async (client, id) => {
    return await client.query(`
        DELETE from drink WHERE id = $1;
        `, [id]
    );
}

module.exports.getDrinkById = async (client, id) => {
    return await client.query(`
        SELECT * from drink WHERE id = $1;
        `, [id]
    );
}