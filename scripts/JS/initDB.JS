const pool = require("../../model/database");
const fs = require("fs");
const path = require("path");

async function initDB() {
    const client = await pool.connect();

    try {
        await client.query(fs.readFileSync(path.join(__dirname, "../SQL/createDB.SQL"), "utf-8"));
        await client.query(fs.readFileSync(path.join(__dirname, "../SQL/fillDB.SQL"), "utf-8"));
    } catch (error) {
        console.log(error);
    } finally {
        client.release();
        await pool.end();
    }
}

initDB().then(() => console.log("init DB done"));
