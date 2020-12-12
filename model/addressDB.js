module.exports.createAddress = async (client, country, postalCode, city, street, number) => {
    return await client.query(`
        INSERT INTO address(country, postal_code, city, street, number)
        VALUES ($1, $2, $3, $4, $5) RETURNING address_id; 
        `, [country, postalCode, city, street, number]
    );
};

module.exports.updateAddress = async (client, country, postalCode, city, street, number, id) => {
    let query = "UPDATE address SET ";
    let argumentsWithoutId = [
        ['country', country],
        ['postal_code', postalCode],
        ['city', city],
        ['street', street],
        ['number', number]
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
        query += ` WHERE address_id = $${params.length};`;

        return client.query(query, params);
    } else {
        throw new Error("No field to update");
    }
};
