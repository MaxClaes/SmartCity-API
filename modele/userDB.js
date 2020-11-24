const {getClient} = require('./clientDB');
const {compareHash} = require('../utils/utils');
const {getHash} = require("../utils/utils");

module.exports.getUserLogin = async (client, email, password) => {
    const promises = [];
    const promiseClient = getClient(client, email);
    promises.push(promiseClient);
    const values = await Promise.all(promises);
    const clientRow = values[0].rows[0];

    if(clientRow !== undefined && await compareHash(password, clientRow.password)){
        return {userType: clientRow.access, value: clientRow};
    } else {
        return {userType: null, value: null}
    }
};

module.exports.getAllUsers = async (client) => {
    const t = await client.query(`
        SELECT client.id, client.name, client.firstname, client.birthdate, client.email, client.registration_date AS registrationDate, 
        client.height, client.weight, client.gsm, client.access, 
        address.id AS addressId, address.country, address.postal_code AS postalCode, address.city, address.street, address.number 
        FROM client INNER JOIN address ON client.address = address.id;`
    );
    return t;
}
module.exports.getUser = async (client, id) => {
    return await client.query(`
        SELECT client.id, client.name, client.firstname, client.birthdate, client.email, client.registration_date, 
        client.height, client.weight, client.gsm, client.access, 
        address.id, address.country, address.postal_code, address.city, address.street, address.number 
        FROM client INNER JOIN address ON client.address = address.id WHERE client.id = $1;`, [id]
    );
}

module.exports.createUser = async (client, name, firstname, birthdate, email, password, height, weight, gsm, addressId) => {
    return await client.query(`
        INSERT INTO client(name, firstname, birthdate, email, password, registration_date, height, weight, gsm, access, address) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`, [name, firstname, birthdate, email, await getHash(password), new Date(), height, weight, gsm, "CLIENT", addressId]
    );
};

module.exports.updateUser = async (client, name, firstname, birthdate, email, password, height, weight, gsm, id) => {
    let query = "UPDATE client SET ";
    let argumentsWithoutId = [
        ['name', name],
        ['firstname', firstname],
        ['birthdate', birthdate],
        ['email', email],
        ['password', password != undefined ? await getHash(password) : password],
        ['height', height],
        ['weight', weight],
        ['gsm', gsm]
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
        query += ` WHERE id = $${params.length};`;

        return client.query(query, params);
    } else {
        throw new Error("No field to update");
    }
};

module.exports.changeAccess = async (client, newAccess, id) => {
    return await client.query(`UPDATE client SET access = $1 WHERE id = $2;`, [newAccess, id]);
};
