const drinkModel = require("../model/drinkDB");
const pool = require("../model/database");
const dto = require('../dto');
const error = require('../error/index');
const { validationResult } = require('express-validator');

module.exports.createDrink = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {label, prcAlcohol, quantity} = req.body;
        const userId = req.session.id;
        const client = await pool.connect();

        try {
            await drinkModel.createDrink(client, label, prcAlcohol, quantity, userId);
            res.sendStatus(201);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.updateDrink = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {label, prcAlcohol, quantity} = req.body;
        const drinkIdTexte = req.params.drinkId;
        const drinkId = parseInt(drinkIdTexte);
        const client = await pool.connect();

        try {
            await drinkModel.updateDrink(client, label, prcAlcohol, quantity, drinkId);
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getAllDrinks = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: drinksEntities} = await drinkModel.getAllDrinks(client);
        const drinkEntity = drinksEntities[0];

        if(drinkEntity !== undefined) {
            const drinks = [];
            drinksEntities.forEach(function(d) {
                drinks.push(dto.drinkDTO(d));
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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const label = req.params.label;
        const labelWithoutSpace = label.trim();
        const client = await pool.connect();

        try {
            const {rows: drinksEntities} = await drinkModel.getDrinksByName(client, labelWithoutSpace.toUpperCase());
            const drinkEntity = drinksEntities[0];

            if (drinkEntity !== undefined) {
                res.json(dto.drinkDTO(drinkEntity));
            } else {
                res.status(404).json({error: error.DRINK_NOT_FOUND});
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getDrinksByCreatedBy = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const userIdTexte = req.params.userId;
        const createdBy = parseInt(userIdTexte);
        const client = await pool.connect();

        try {
            const {rows: drinksEntities} = await drinkModel.getDrinksByCreatedBy(client, createdBy);
            const drinkEntity = drinksEntities[0];

            if (drinkEntity !== undefined) {
                const drinks = [];
                drinksEntities.forEach(function (d) {
                    drinks.push(dto.drinkDTO(d));
                });
                res.json(drinks);
            } else {
                res.status(404).json({error: [error.DRINK_NOT_FOUND]});
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.deleteDrink = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const drinkIdTexte = req.params.drinkId;
        const drinkId = parseInt(drinkIdTexte);
        const client = await pool.connect();

        try {
            await drinkModel.deleteDrink(client, drinkId);
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

// module.exports.getDrinkById = async (req, res) => {
//     const idTexte = req.params.id;
//     const id = parseInt(idTexte);
//     const client = await pool.connect();
//
//     try{
//         if(isNaN(id)){
//             res.sendStatus(400);
//         } else {
//             const {rows: drinksEntities} = await drinkModel.getDrinkById(client, id);
//             const drinkEntity = drinksEntities[0];
//
//             if(drinkEntity !== undefined){
//                 res.json(dto.drinkDTO(drinkEntity));
//             } else {
//                 res.sendStatus(404);
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         res.sendStatus(500);
//     } finally {
//         client.release();
//     }
// }

module.exports.resetReport = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const drinkIdTexte = req.params.drinkId;
        const drinkId = parseInt(drinkIdTexte);
        const client = await pool.connect();

        try {
            await drinkModel.resetReport(client, drinkId);
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.incrementReport = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const drinkIdTexte = req.params.drinkId;
        const drinkId = parseInt(drinkIdTexte);
        const client = await pool.connect();

        try {
            await drinkModel.incrementReport(client, drinkId);
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}
