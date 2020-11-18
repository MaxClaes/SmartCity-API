module.exports.createBoisson = async (client, label, prcAlcool, quantite) => {
    const nbSignalementInitial = 0;

    return await client.query(`
        INSERT INTO boisson(label, prcAlcool, quantite, nbSignalements) 
        VALUES ($1, $2, $3, $4)`, [label, prcAlcool, quantite, nbSignalementInitial]
    );
};

module.exports.updateBoisson = async (client, label, prcAlcool, quantite, id) => {
     return await client.query(`
        UPDATE boisson SET label = $1, prcAlcool = $2, quantite = $3
        WHERE id = $4
   `, [label, prcAlcool, quantite, id]);
};

module.exports.getBoissonByName = async (client, label) => {
    return await client.query(`
        SELECT * FROM boisson WHERE label = $1;
    `, [label]);
};
