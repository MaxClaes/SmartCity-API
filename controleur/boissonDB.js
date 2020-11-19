const BoissonModele = require("../modele/boissonDB");
const pool = require("../modele/database");

module.exports.createBoisson = async (req, res) => {
    const body = req.body;
    const {label, prcAlcool, quantite} = body;
    const client = await pool.connect();

    try {
        await BoissonModele.createBoisson(client, label, prcAlcool, quantite);
        res.sendStatus(201);
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.updateBoisson = async (req, res) => {
    const {label, prcAlcool, quantite, id} = req.body;
    const client = await pool.connect();

    try {
        await BoissonModele.updateBoisson(label, prcAlcool, quantite, id);
        res.sendStatus(204);
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getAllBoissons = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: boissons} = await BoissonModele.getAllBoissons(client);
        const boisson = boissons[0];

        if(boisson !== undefined){
            res.json(boissons);
        } else {
            res.sendStatus(404);
        }
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getBoissonsByName = async (req, res) => {
    const label = req.params.label;
    const client = await pool.connect();

    try {
        const {rows: boissons} = await BoissonModele.getBoissonsByName(client, label);
        const boisson = boissons[0];

        if(boisson !== undefined){
            res.json(boissons);
        } else {
            res.sendStatus(404);
        }
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getBoissonsByUserId = async (req, res) => {
    const userId = req.params.userId;

    try {
        const {rows: boissons} = await BoissonModele.getBoissonsByUserId(client, userId);
        const boisson = boissons[0];

        if(boisson !== undefined){
            res.json(boissons);
        } else {
            res.sendStatus(404);
        }
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.deleteBoisson = async (req, res) => {
    const id = req.body;
    const client = await pool.connect();

    try {
        await BoissonModele.deleteBoisson(client, id);
        res.sendStatus(204);
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}
