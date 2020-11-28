const {compareHash} = require('../utils/utils');
const {getHash} = require("../utils/utils");
const Constants = require("../utils/constant");

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

// module.exports.getAllUsers = async (client) => {
//     return await client.query(`
//         SELECT client.id as user_id, client.name as user_name, client.firstname as user_firstname, client.birthdate as user_birthdate,
//         client.email as user_email, client.registration_date as user_registration_date, client.height as user_height,
//         client.weight as user_weight, client.gsm as user_gsm, client.role as user_role,
//         address.id as address_id, address.country as address_country, address.postal_code as address_postal_code,
//         address.city as address_city, address.street as address_street, address.number as address_number
//         FROM client INNER JOIN address ON client.address = address.id;`
//     );
// }

// module.exports.getAllUsers = async (client) => {
//     const t = await client.query(`
//         SELECT client.id as user_id, client.name as user_name, client.firstname as user_firstname, client.birthdate as user_birthdate,
//         client.email as user_email, client.registration_date as user_registration_date, client.height as user_height,
//         client.weight as user_weight, client.gsm as user_gsm, client.role as user_role,
//         address.id as address_id, address.country as address_country, address.postal_code as address_postal_code,
//         address.city as address_city, address.street as address_street, address.number as address_number
//         FROM client INNER JOIN address ON client.address = address.id;`
//     );
//     return t;
// }

// module.exports.getAllUsers = async (client) => {
//     const t = await client.query(`
//         SELECT client.c_id, client.c_name, client.c_firstname, client.c_birthdate, client.c_email, client.c_registration_date,
//         client.c_height, client.c_weight, client.c_gsm, client.c_role,
//         address.a_id, address.a_country, address.a_postal_code, address.a_city, address.a_street, address.a_number
//         FROM client as c INNER JOIN address as a ON c.address = a.id;`
//     );
//     return t;
// }


// module.exports.getAllUsers = async (client) => {
//     return await client.query(`
//         SELECT client.id as cli_id, client.name as cli_name, client.firstname as cli_firstname, client.birthdate as cli_birthdate,
//         client.email as cli_email, client.registration_date as cli_registration_date, client.height as cli_height, client.weight as cli_weight,
//         client.gsm as cli_gsm, client.role as cli_role, address.id as adr_id, address.country as adr_country, address.postal_code as adr_postal_code,
//         address.city as adr_city, address.street as adr_street, address.number as adr_number
//         FROM client INNER JOIN address ON client.address = address.id;`
//     );
// }

module.exports.getAllUsers = async (client) => {
    return await client.query(`
        SELECT client.client_id, client.name, client.firstname, client.birthdate, 
        client.email, client.registration_date, client.height, client.weight, 
        client.gsm, client.role, address.address_id, address.country, address.postal_code, 
        address.city, address.street, address.number
        FROM client INNER JOIN address ON client.address = address.address_id;`
    );
}

module.exports.getUser = async (client, id) => {
    return await client.query(`
        SELECT client.client_id, client.name, client.firstname, client.birthdate, 
        client.email, client.registration_date, client.height, client.weight, 
        client.gsm, client.role, address.address_id, address.country, address.postal_code, 
        address.city, address.street, address.number 
        FROM client INNER JOIN address ON client.address = address.address_id WHERE client.client_id = $1;`, [id]
    );
}

module.exports.createUser = async (client, name, firstname, birthdate, email, password, registrationDate, height, weight, gsm, addressId) => {
    return await client.query(`
        INSERT INTO client(name, firstname, birthdate, email, password, registration_date, height, weight, gsm, role, address) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`, [name, firstname, birthdate, email, await getHash(password), registrationDate, height, weight, gsm, Constants.ROLE_CLIENT, addressId]
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

module.exports.changeRole = async (client, role, id) => {
    return await client.query(`UPDATE client SET role = $1 WHERE id = $2;`, [role, id]);
};

module.exports.userExist = async (client, userId) => {
    const {rows} = await client.query(
        "SELECT count(id) AS nbr FROM client WHERE id = $1",
        [userId]
    );
    return rows[0].nbr > 0;
};
