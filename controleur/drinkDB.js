const DrinkModele = require("../modele/drinkDB");
const pool = require("../modele/database");

module.exports.createDrink = async (req, res) => {
    const {label, prcAlcohol, quantity} = req.body;
    const createdBy = req.session.id;
    const client = await pool.connect();

    try {
        await DrinkModele.createDrink(client, label, prcAlcohol, quantity, createdBy);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
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
    } catch (error) {
        console.log(error);
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
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getDrinksByName = async (req, res) => {
    const label = req.params.label;
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
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getDrinksByCreatedBy = async (req, res) => {
    const idTexte = req.params.id;
    const createdBy = parseInt(idTexte);
    const client = await pool.connect();

    try {
        if (isNaN(createdBy)) {
            res.sendStatus(400);
        } else {
            const {rows: drinks} = await DrinkModele.getDrinksByCreatedBy(client, createdBy);
            const drink = drinks[0];

            if (drink !== undefined) {
                res.json(drinks);
            } else {
                res.sendStatus(404);
            }
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.deleteDrink = async (req, res) => {
    const idTexte = req.params.id;
    const id = parseInt(idTexte);
    const client = await pool.connect();

    try {
        if (isNaN(id)) {
            res.sendStatus(400);
        } else {
            await DrinkModele.deleteDrink(client, id);
            res.sendStatus(204);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getDrinkById = async (req, res) => {
    const idTexte = req.params.id;
    const id = parseInt(idTexte);
    const client = await pool.connect();

    try{
        if(isNaN(id)){
            res.sendStatus(400);
        } else {
            const {rows: drinks} = await DrinkModele.getDrinkById(client, id);
            const drink = drinks[0];

            if(drink !== undefined){
                res.json(drinks);
            } else {
                res.sendStatus(404);
            }
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}
