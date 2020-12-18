const drinkModel = require("../model/drinkDB");
const consumptionModel = require("../model/consumptionDB");
const pool = require("../model/database");
const dto = require('../dto');
const error = require('../error/index');
const { validationResult } = require('express-validator');

/**
 * @swagger
 * components:
 *  schemas:
 *      Drink:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *              label:
 *                  type: string
 *              prcAlcohol:
 *                  type: number
 *              quantity:
 *                  type: number
 *              nbReports:
 *                  type: number
 *              popularity:
 *                  type: number
 *              createdBy:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: number
 *                      name:
 *                          type: string
 *                      firstname:
 *                          type: string
 *                      birthdate:
 *                          type: string
 *                      email:
 *                          type: string
 *                      registrationDate:
 *                          type: string
 *                      gender:
 *                          type: string
 *                      height:
 *                          type: number
 *                      weight:
 *                          type: number
 *                      gsm:
 *                          type: string
 *                      role:
 *                          type: string
 */

/**
 * @swagger
 * components:
 *  responses:
 *      DrinkInserted:
 *          description: the drink has been added to database
 *  requestBodies:
 *      DrinkToInsert:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          label:
 *                              type: string
 *                          prcAlcohol:
 *                              type: number
 *                          quantity:
 *                              type: number
 *                      required:
 *                          - label
 *                          - prcAlcohol
 *                          - quantity
 */
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
/**
 * @swagger
 * components:
 *  responses:
 *      DrinkUpdated:
 *          description: the drink has been updated
 *  requestBodies:
 *      DrinkToUpdate:
 *          content:
 *              application/json:
 *                  schema:
 *                      properties:
 *                          label:
 *                              type: string
 *                          prcAlcohol:
 *                              type: number
 *                          quantity:
 *                              type: number
 *                      required:
 *                          - label
 *                          - prcAlcohol
 *                          - quantity
 */
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
/**
 * @swagger
 * components:
 *  responses:
 *      DrinksFound:
 *          description: send back a list of drinks
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Drink'
 */
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
/**
 * @swagger
 * components:
 *  responses:
 *      DrinksFoundByLabel:
 *          description: send back a list of drinks
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Drink'
 */
module.exports.getDrinksByName = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const label = req.params.label;
        // const labelWithoutSpace = label.trim();
        const client = await pool.connect();

        try {
            const {rows: drinksEntities} = await drinkModel.getDrinksByName(client, label.toUpperCase(), label.length);
            const drinkEntity = drinksEntities[0];

            if (drinkEntity !== undefined) {
                const drinks = [];
                drinksEntities.forEach(function(d) {
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
/**
 * @swagger
 * components:
 *  responses:
 *      DrinkFoundByUserId:
 *          description: send back a list of drinks created by a user
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Drink'
 */
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
/**
 * @swagger
 * components:
 *  responses:
 *      DrinkDeleted:
 *          description: delete a drink by id
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Drink'
 */
module.exports.deleteDrink = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const drinkIdTexte = req.params.drinkId;
        const drinkId = parseInt(drinkIdTexte);
        const client = await pool.connect();

        try {
            if (await consumptionModel.consumptionByDrinkIdExists(client, drinkId)) {
                await drinkModel.setDisabledByDrinkId(client, drinkId);
            } else {
                await drinkModel.deleteDrink(client, drinkId);
            }
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}
/**
 * @swagger
 * components:
 *  responses:
 *      DrinkReportReseted:
 *          description: reset to 0 nb reports of a drink
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Drink'
 */
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
/**
 * @swagger
 * components:
 *  responses:
 *      DrinkReportIncremented:
 *          description: Report of drink has been incremented
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Drink'
 */
module.exports.manageReport = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const drinkIdTexte = req.params.drinkId;
        const numberTexte = req.params.number;
        const drinkId = parseInt(drinkIdTexte);
        const number = parseInt(numberTexte);
        const client = await pool.connect();

        try {
            const {rows: drinksEntities} = await drinkModel.getDrinkById(client, drinkId);
            const drinkEntity = drinksEntities[0];

            if (drinkEntity !== undefined) {
                const drink = dto.drinkDTO(drinkEntity);

                if (drink.nbReports <= 0 && number === -1) {
                    res.status(400).json({error: [error.DRINK_HAS_MINIMUM_REPORTS]});
                } else {
                    await drinkModel.manageReport(client, drinkId, number);
                    res.sendStatus(204);
                }
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
