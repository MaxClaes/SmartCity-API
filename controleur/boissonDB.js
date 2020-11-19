const DrinkModele = require("../modele/drinkDB");
const pool = require("../modele/database");

module.exports.createDrink = async (req, res) => {
    const body = req.body;
    const {label, prcAlcohol, quantity} = body;
    const client = await pool.connect();

    try {
        await DrinkModele.createDrink(client, label, prcAlcohol, quantity);
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
        await DrinkModele.updateDrink(label, prcAlcohol, quantity, id);
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
    const label = req.params.label;
    const client = await pool.connect();

    try {
        const {rows: drinks} = await DrinkModele.getDrinksByName(client, label);
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
    const userId = req.params.userId;

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
    const id = req.body;
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
