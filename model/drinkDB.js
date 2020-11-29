module.exports.createDrink = async (client, label, prcAlcohol, quantity, createdBy) => {
    return await client.query(`
        INSERT INTO drink(label, prc_alcohol, quantity, created_by) 
        VALUES ($1, $2, $3, $4, $5);
        `, [label, prcAlcohol, quantity, createdBy]
    );
};

/*
 On ne permet pas de passer nbSignalement car ce sera trop risqué qu'un utilisateur puisse modifier cette variable comme il le souhaite
 */
module.exports.updateDrink = async (client, label, prcAlcohol, quantity, id) => {
     return await client.query(`
        UPDATE drink SET label = $1, prc_alcohol = $2, quantity = $3
        WHERE drink_id = $4;
        `, [label, prcAlcohol, quantity, id]
     );
};

module.exports.getAllDrinks = async (client) => {
    return await client.query(`SELECT * FROM drink;`);
}

module.exports.getDrinksByName = async (client, label) => {
    return await client.query(`
        SELECT * FROM drink WHERE UPPER(label) = $1;
        `, [label]
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
        DELETE from drink WHERE drink_id = $1;
        `, [id]
    );
}

module.exports.getDrinkById = async (client, id) => {
    return await client.query(`
        SELECT * from drink WHERE drink_id = $1;
        `, [id]
    );
}

module.exports.resetReport = async (client, id) => {
    const nbReportsInitial = 0;

    return await client.query(`
        UPDATE drink SET nb_reports = $1
        WHERE drink_id = $2;
        `, [nbReportsInitial, id]
    );
}

module.exports.incrementReport = async (client, id) => {
    return await client.query(`
        UPDATE drink SET nb_reports = (nb_reports + 1)
        WHERE drink_id = $1;
        `, [id]
    );
}