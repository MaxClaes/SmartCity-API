const DrinkModel = require("../modele/drinkDB");
const pool = require("../modele/database");
const DTO = require('../dto/dto');

module.exports.createDrink = async (req, res) => {
    const {label, prcAlcohol, quantity} = req.body;
    const createdBy = req.session.id;
    const client = await pool.connect();

    try {
        await DrinkModel.createDrink(client, label, prcAlcohol, quantity, createdBy);
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
        await DrinkModel.updateDrink(client, label, prcAlcohol, quantity, id);
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
        const {rows: drinksEntities} = await DrinkModel.getAllDrinks(client);
        const drinkEntity = drinksEntities[0];

        if(drinkEntity !== undefined) {
            const drinks = [];
            drinksEntities.forEach(function(d) {
                drinks.push(DTO.drinkDTO(d));
            });
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
        const {rows: drinksEntities} = await DrinkModel.getDrinksByName(client, labelWithoutSpace.toUpperCase());
        const drinkEntity = drinksEntities[0];

        if(drinkEntity !== undefined) {
            res.json(DTO.drinkDTO(drinkEntity));
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
            const {rows: drinksEntities} = await DrinkModel.getDrinksByCreatedBy(client, createdBy);
            const drinkEntity = drinksEntities[0];

            if (drinkEntity !== undefined) {
                const drinks = [];
                drinksEntities.forEach(function(d) {
                    drinks.push(DTO.drinkDTO(d));
                });
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
            await DrinkModel.deleteDrink(client, id);
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
            const {rows: drinksEntities} = await DrinkModel.getDrinkById(client, id);
            const drinkEntity = drinksEntities[0];

            if(drinkEntity !== undefined){
                res.json(DTO.drinkDTO(drinkEntity));
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

module.exports.resetReport = async (req, res) => {
    const drinkIdTexte = req.params.drinkId;
    const drinkId = parseInt(drinkIdTexte);
    const client = await pool.connect();

    try {
        await DrinkModel.resetReport(client, drinkId);
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
        await DrinkModel.incrementReport(client, drinkId);
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}
