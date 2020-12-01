module.exports.createConsumption = async (client, date, userId, drinkId) => {
    return await client.query(`
        INSERT INTO consumption(date, client_id, drink_id) 
        VALUES ($1, $2, $3);
        `, [date, userId, drinkId]
    );
};

module.exports.updateConsumption = async (client, consumptionId, date) => {
    return await client.query(`
        UPDATE consumption SET date = $1
        WHERE consumption_id = $2;
        `, [date, consumptionId]
    );
};

module.exports.getAllConsumptionsByUserId = async (client, userId) => {
    return await client.query(`
        SELECT consumption.consumption_id, consumption.date, drink.drink_id, drink.label, drink.prc_alcohol, drink.quantity 
        FROM consumption INNER JOIN drink on consumption.drink_id = drink.drink_id WHERE consumption.client_id = $1 
        ORDER BY consumption.date DESC;
        `, [userId]
    );
}

// module.exports.getAllConsumptionsByDate = async (client, userId, date) => {
//     return await client.query(`
//         SELECT consumption.consumption_id, consumption.date, drink.drink_id, drink.label, drink.prc_alcohol, drink.quantity
//         FROM consumption INNER JOIN drink on consumption.drink_id = drink.drink_id
//         WHERE consumption.client_id = $1 AND consumption.date = $2
//         ORDER BY consumption.consumption_id DESC;
//         `, [userId, date]
//     );
// }

module.exports.getAllConsumptionsAfterDate = async (client, userId, date) => {
    return await client.query(`
        SELECT consumption.consumption_id, consumption.date, drink.drink_id, drink.label, drink.prc_alcohol, drink.quantity
        FROM consumption INNER JOIN drink on consumption.drink_id = drink.drink_id 
        WHERE consumption.client_id = $1 AND consumption.date > $2
        ORDER BY consumption.consumption_id DESC;
        `, [userId, date]
    );
}

module.exports.deleteConsumption = async (client, consumptionId) => {
    return await client.query(`
        DELETE from consumption WHERE consumption_id = $1;
        `, [consumptionId]
    );
}

module.exports.consumptionExists = async (client, id) => {
    const {rows} = await client.query(
        "SELECT count(consumption_id) AS nbr FROM consumption WHERE consumption_id = $1",
        [id]
    );
    return rows[0].nbr > 0;
};
