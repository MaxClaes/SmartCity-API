module.exports.createConsumption = async (client, userId, drinkId, date) => {
    return await client.query(`
        INSERT INTO consumption(client_id, drink_id, date) 
        VALUES ($1, $2, $3);
        `, [userId, drinkId, date]
    );
};

module.exports.updateConsumption = async (client, userId, drinkId, date) => {
    return await client.query(`
        UPDATE consumption SET date = $1
        WHERE client_id = $2 AND drink_id = $3;
        `, [date, userId, drinkId]
    );
};

module.exports.getAllConsumptionByUserId = async (client, userId) => {
    return await client.query(`
        SELECT * FROM consumption WHERE client_id = $1;
        `, [userId]
    );
}

module.exports.getAllConsumptionByDate = async (client, date) => {
    return await client.query(`
        SELECT * FROM consumption ORDER BY date DESC WHERE date = $1;
        `, [date]
    );
}

module.exports.deleteConsumption = async (client, userId, drinkId) => {
    return await client.query(`
        DELETE from consumption WHERE client_id = $1 AND drink_id = $2;
        `, [userId, drinkId]
    );
}


