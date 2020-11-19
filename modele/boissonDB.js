module.exports.createBoisson = async (client, label, prcAlcool, quantite) => {
    const nbSignalementInitial = 0; //Faire dans le fichier sql de création de table pour que cette variable soit initialisée à 0

    return await client.query(`
        INSERT INTO boisson(label, prcAlcool, quantite, nbSignalements) 
        VALUES ($1, $2, $3, $4);
        `, [label, prcAlcool, quantite, nbSignalementInitial]
    );
};

/*
 On ne permet pas de passer nbSignalement car ce sera trop risqué qu'un utilisateur puisse modifier cette variable comme il le souhaite
 */
module.exports.updateBoisson = async (client, label, prcAlcool, quantite, id) => {
     return await client.query(`
        UPDATE boisson SET label = $1, prcAlcool = $2, quantite = $3, nbSignalements = $4
        WHERE id = $5;
        `, [label, prcAlcool, quantite, nbSignalements, id]
     );
};

module.exports.getAllBoissons = async (client) => {
    return await client.query(`SELECT * FROM boisson;`);
}

module.exports.getBoissonsByName = async (client, label) => {
    return await client.query(`
        SELECT * FROM boisson WHERE label = $1;
        `, [label]
    );
};

module.exports.getBoissonsByUserId = async (client, userId) => {
    return await client.query(`
        SELECT * FROM boisson WHERE createBy = $1;
        `, [userId]
    );
};

module.exports.deleteBoisson = async (client, id) => {
    return await client.query(`
        DELETE from boisson WHERE id = $1;
        `, [id]
    );
}
