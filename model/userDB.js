const {compareHash} = require('../utils/utils');
const {getHash} = require("../utils/utils");
const constant = require("../utils/constant");

module.exports.getUserLogin = async (client, email, password) => {
    const promises = [];
    const promiseUser = this.getUserByEmail(client, email);
    promises.push(promiseUser);
    const values = await Promise.all(promises);
    const userRow = values[0].rows[0];

    if(userRow !== undefined && await compareHash(password, userRow.password)) {
        return {userType: userRow.role, value: userRow};
    } else {
        return {userType: null, value: null}
    }
};

module.exports.getUserByEmail = async (client, email) => {
    return await client.query(`
        SELECT * FROM client WHERE email = $1;
    `, [email]);
};

module.exports.getAllUsers = async (client) => {
    return await client.query(`
        SELECT client.client_id, client.name, client.firstname, client.birthdate, 
        client.email, client.registration_date, client.gender, client.height, client.weight, 
        client.gsm, client.role, address.address_id, address.country, address.postal_code, 
        address.city, address.street, address.number
        FROM client INNER JOIN address ON client.address = address.address_id;`
    );
}

module.exports.getUsersByName = async (client, name) => {
    return await client.query(`
        SELECT * FROM client WHERE SUBSTRING(UPPER(name), 1, $1) = $2 OR SUBSTRING(UPPER(firstname), 1, $1) = $2
        ORDER BY client.firstname;
    `, [name.length, name.toUpperCase()]);
};

module.exports.getUser = async (client, id) => {
    return await client.query(`
        SELECT client.client_id, client.name, client.firstname, client.birthdate, 
        client.email, client.registration_date, client.gender, client.height, client.weight, 
        client.gsm, client.role, address.address_id, address.country, address.postal_code, 
        address.city, address.street, address.number 
        FROM client INNER JOIN address ON client.address = address.address_id WHERE client.client_id = $1;`, [id]
    );
}

module.exports.createUser = async (client, name, firstname, birthdate, email, password, registrationDate, gender, height, weight, gsm, addressId) => {
    return await client.query(`
        INSERT INTO client(name, firstname, birthdate, email, password, registration_date, gender, height, weight, gsm, role, address) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`, [name, firstname, birthdate, email, await getHash(password), registrationDate, gender, height, weight, gsm, constant.ROLE_CLIENT, addressId]
    );
};

module.exports.updateUser = async (client, name, firstname, gender, height, weight, gsm, id) => {
    let query = "UPDATE client SET ";
    let argumentsWithoutId = [
        ['name', name],
        ['firstname', firstname],
        ['gender', gender],
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
        query += ` WHERE client_id = $${params.length};`;

        return client.query(query, params);
    } else {
        throw new Error("No field to update");
    }
};

module.exports.changeRole = async (client, role, id) => {
    return await client.query(`UPDATE client SET role = $1 WHERE client_id = $2;`, [role, id]);
};

module.exports.userExists = async (client, id) => {
    const {rows} = await client.query(
        "SELECT count(client_id) AS nbr FROM client WHERE client_id = $1",
        [id]
    );
    return rows[0].nbr > 0;
};

module.exports.emailExists = async (client, email) => {
    const {rows} = await client.query(`
        SELECT count(client_id) AS nbr FROM client WHERE email = $1;
    `, [email]);
    return rows[0].nbr > 0;
};
