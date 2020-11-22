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
    return  await client.query(`
        SELECT name, firstname, birthdate, email, registration_date, height, weight, gsm, access, address.country, address.postal_code, address.city, address.street, address.number FROM client
        INNER JOIN address ON client.address = address.id;`
    );
}
module.exports.getUser = async (client, id) => {
    return  await client.query(`
        SELECT name, firstname, birthdate, email, registration_date, height, weight, gsm, access, address.country, address.postal_code, address.city, address.street, address.number FROM client
        INNER JOIN address ON client.address = address.id WHERE client.id = $1;`, [id]
    );
}

module.exports.createUser = async (client, name, firstname, birthdate, email, password, height, weight, gsm, addressId) => {
    return await client.query(`
        INSERT INTO client(name, firstname, birthdate, email, password, registration_date, height, weight, gsm, access, address) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [name, firstname, birthdate, email, await getHash(password), new Date(), height, weight, gsm, "CLIENT", addressId]
    );
};

module.exports.updateUser = async (client, id, nom, prenom, adresse, password) => {
    /*
     return await client.query(`
        UPDATE client SET nom = $1, prenom = $2, adresse = $3, password = $4
        WHERE id = $5
   `, [nom, prenom, adresse, password, id]);
     */
    const params = [];
    const querySet = [];
    let query = "UPDATE client SET ";
    if(nom !== undefined){
        params.push(nom);
        querySet.push(` nom = $${params.length} `);
    }
    if(prenom !== undefined){
        params.push(prenom);
        querySet.push(` prenom = $${params.length} `);
    }
    if(adresse !== undefined){
        params.push(adresse);
        querySet.push(` adresse = $${params.length} `);
    }
    if(password !== undefined){
        params.push(await getHash(password));
        querySet.push(` password = $${params.length} `);
    }

    if(params.length > 0){
        query += querySet.join(',');
        params.push(id);
        query += ` WHERE id = $${params.length}`;

        return client.query(query, params);
    } else {
        throw new Error("No field to update");
    }


};