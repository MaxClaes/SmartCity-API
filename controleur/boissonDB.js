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

module.exports.getBoissonByName = async (req, res) => {
    const client = await pool.connect();
    const label = req.params.label;

    try {
        const {rows: boissons} = await BoissonModele.getBoissonByName(client, label);
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


//getBoissonByUserId à créer !


module.exports.deleteBoisson = async (req, res) => {
    const {id} = req.body;
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
