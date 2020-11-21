const DrinkModele = require("../modele/drinkDB");
const pool = require("../modele/database");

module.exports.createDrink = async (req, res) => {
    const {label, prcAlcohol, quantity} = req.body;
    const created_by = req.session.id;
    const client = await pool.connect();

    try {
        await DrinkModele.createDrink(client, label, prcAlcohol, quantity, created_by);
        res.sendStatus(201);
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.updateDrink = async (req, res) => {
    const {label, prcAlcohol, quantity, id} = req.body;
    const client = await pool.connect();

    try {
        await DrinkModele.updateDrink(client, label, prcAlcohol, quantity, id);
        res.sendStatus(204);
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getAllDrinks = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: drinks} = await DrinkModele.getAllDrinks(client);
        const drink = drinks[0];

        if(drink !== undefined){
            res.json(drinks);
        } else {
            res.sendStatus(404);
        }
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getDrinksByName = async (req, res) => {
    const {label} = req.body;
    const labelWithoutSpace = label.trim();
    const client = await pool.connect();

    try {
        const {rows: drinks} = await DrinkModele.getDrinksByName(client, labelWithoutSpace);
        const drink = drinks[0];

        if(drink !== undefined){
            res.json(drinks);
        } else {
            res.sendStatus(404);
        }
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getDrinksByUserId = async (req, res) => {
    const {userId} = req.body;
    const client = await pool.connect();

    try {
        const {rows: drinks} = await DrinkModele.getDrinksByUserId(client, userId);
        const drink = drinks[0];

        if(drink !== undefined){
            res.json(drinks);
        } else {
            res.sendStatus(404);
        }
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.deleteDrink = async (req, res) => {
    const {id} = req.body;
    const client = await pool.connect();

    try {
        await DrinkModele.deleteDrink(client, id);
        res.sendStatus(204);
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}
