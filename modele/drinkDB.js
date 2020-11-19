module.exports.createDrink = async (client, label, prcAlcool, quantite) => {
    const nbReportsInitial = 0; //Faire dans le fichier sql de création de table pour que cette variable soit initialisée à 0

    return await client.query(`
        INSERT INTO drink(label, prc_alcool, quantite, nb_reports) 
        VALUES ($1, $2, $3, $4);
        `, [label, prcAlcool, quantite, nbReportsInitial]
    );
};

/*
 On ne permet pas de passer nbSignalement car ce sera trop risqué qu'un utilisateur puisse modifier cette variable comme il le souhaite
 */
module.exports.updateDrink = async (client, label, prcAlcool, quantite, id) => {
     return await client.query(`
        UPDATE drink SET label = $1, prc_alcool = $2, quantite = $3, nb_reports = $4
        WHERE id = $5;
        `, [label, prcAlcool, quantite, nbReports, id]
     );
};

module.exports.getAllDrinks = async (client) => {
    return await client.query(`SELECT * FROM drink;`);
}

module.exports.getDrinksByName = async (client, label) => {
    return await client.query(`
        SELECT * FROM drink WHERE label = $1;
        `, [label]
    );
};

module.exports.getDrinksByUserId = async (client, userId) => {
    return await client.query(`
        SELECT * FROM drink WHERE created_by = $1;
        `, [userId]
    );
};

module.exports.deleteDrink = async (client, id) => {
    return await client.query(`
        DELETE from drink WHERE id = $1;
        `, [id]
    );
}
