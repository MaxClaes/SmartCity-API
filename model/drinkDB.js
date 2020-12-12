module.exports.createDrink = async (client, label, prcAlcohol, quantity, createdBy) => {
    return await client.query(`
        INSERT INTO drink(label, prc_alcohol, quantity, created_by) 
        VALUES ($1, $2, $3, $4) RETURNING drink_id;
        `, [label, prcAlcohol, quantity, createdBy]
    );
};

module.exports.updateDrink = async (client, label, prcAlcohol, quantity, id) => {
    let query = "UPDATE drink SET ";
    let argumentsWithoutId = [
        ['label', label],
        ['prc_alcohol', prcAlcohol],
        ['quantity', quantity]
    ];
    const params = [], querySet = [];
    const KEY = 0, VALUE = 1;

    argumentsWithoutId.forEach(function(arg) {
        if (arg[VALUE] != undefined) {
            params.push(arg[VALUE]);
            querySet.push(` ${arg[KEY]} = $${params.length} `);
        }
    });

    if(params.length > 0){
        query += querySet.join(',');
        params.push(id);
        query += ` WHERE drink_id = $${params.length};`;

        return client.query(query, params);
    } else {
        throw new Error("No field to update");
    }
};

module.exports.getAllDrinks = async (client) => {
    return await client.query(`SELECT * FROM drink WHERE drink.disabled = FALSE ORDER BY drink.label ASC;`);
};

module.exports.getDrinksByName = async (client, label, nbFirstLetters) => {
    return await client.query(`
        SELECT drink_id, label, prc_alcohol, quantity, created_by, nb_reports, popularity, created_by FROM drink WHERE SUBSTRING(UPPER(label), 1, $1) = $2 AND disabled = FALSE;
        `, [nbFirstLetters, label]
    );
};

module.exports.getDrinksByCreatedBy = async (client, createdBy) => {
    return await client.query(`
        SELECT * FROM drink WHERE created_by = $1 AND disabled = FALSE;
        `, [createdBy]
    );
};

module.exports.deleteDrink = async (client, id) => {
    return await client.query(`
        DELETE from drink WHERE drink_id = $1;
        `, [id]
    );
};

module.exports.getDrinkById = async (client, id) => {
    return await client.query(`
        SELECT * from drink WHERE drink_id = $1;
        `, [id]
    );
};

module.exports.drinkExists = async (client, drinkId) => {
    const {rows} = await client.query(
        "SELECT count(drink_id) AS nbr FROM drink WHERE drink_id = $1",
        [drinkId]
    );
    return rows[0].nbr > 0;
};


module.exports.resetReport = async (client, id) => {
    const nbReportsInitial = 0;

    return await client.query(`
        UPDATE drink SET nb_reports = $1
        WHERE drink_id = $2;
        `, [nbReportsInitial, id]
    );
};

module.exports.manageReport = async (client, id, number) => {
    return await client.query(`
        UPDATE drink SET nb_reports = (nb_reports + $1)
        WHERE drink_id = $2;
        `, [number, id]
    );
};

module.exports.changePopularityByOne = async (client, id, nb) => {
    return await client.query(`
        UPDATE drink SET popularity = (popularity + $1)
        WHERE drink_id = $2;
        `, [nb, id]
    );
};

module.exports.setDisabledByDrinkId = async (client, drinkId) => {
    return await client.query(`
        UPDATE drink SET disabled = TRUE
        WHERE drink_id = $1;
        `, [drinkId]
    );
};
