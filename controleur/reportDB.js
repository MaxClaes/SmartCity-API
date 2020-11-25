const ReportModel = require("../modele/reportDB");
const pool = require("../modele/database");

module.exports.resetReport = async (req, res) => {
    const drinkIdTexte = req.params.drinkId;
    const drinkId = parseInt(drinkIdTexte);
    const client = await pool.connect();

    try {
        await ReportModel.resetReport(client, drinkId);
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.incrementReport = async (req, res) => {
    const drinkIdTexte = req.params.drinkId;
    const drinkId = parseInt(drinkIdTexte);
    const client = await pool.connect();

    try {
        await ReportModel.incrementReport(client, drinkId);
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}
