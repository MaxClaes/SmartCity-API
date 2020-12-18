require("dotenv").config();
const process = require("process");
const pg = require("pg");
const Pool = pg.Pool;

const username = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbDatabase = process.env.DB_DATABASE
const dbPort = process.env.DB_PORT;

const connectionString = `postgresql://${username}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}?ssl=true`

const pool = new Pool({
    connectionString
});

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

module.exports = pool;
