module.exports.createAddress = async (client, country, postalCode, city, street, number) => {
    return await client.query(`
        INSERT INTO address(country, postal_code, city, street, number)
        VALUES ($1, $2, $3, $4, $5) RETURNING address_id; 
        `, [country, postalCode, city, street, number]
    );
};

module.exports.getAddress = async (client, country, postalCode, city, street, number) => {
    return await client.query(`
        SELECT id FROM address WHERE country = $1 AND postal_code = $2 AND city = $3 AND street = $4 AND number = $5;
        `, [country, postalCode, city, street, number]
    );
};
