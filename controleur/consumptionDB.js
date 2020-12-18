const consumptionModel = require("../model/consumptionDB");
const userModel = require("../model/userDB");
const drinkModel = require("../model/drinkDB");
const pool = require("../model/database");
const constant = require('../utils/constant');
const dto = require('../dto');
const error = require('../error/index');
const { validationResult } = require('express-validator');

module.exports.createConsumption = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {drinkId, date, label, quantity, prcAlcohol} = req.body;
        const client = await pool.connect();

        try {
            client.query("BEGIN;");
            if (drinkId !== undefined) {
                const {rows: drinksEntities} = await drinkModel.getDrinkById(client, drinkId);
                const drinkEntity = drinksEntities[0];
                let tempDrinkId = drinkId;

                if (drinkEntity !== undefined) {
                    //Verifier si les informations sont les mêmes
                    //Si elles sont les mêmes alors on crée la consommation
                    let drink = dto.drinkDTO(drinksEntities[0]);

                    if (drink.id !== drinkId || drink.label !== label || drink.quantity !== quantity || drink.prcAlcohol !== prcAlcohol) {
                        const {rows: drinks} = await drinkModel.createDrink(client, label, prcAlcohol, quantity, req.session.id);
                        tempDrinkId = drinks[0].drink_id;
                    }
                } else {
                    //Sinon on crée la boisson et la consommation
                    const {rows: drinks} = await drinkModel.createDrink(client, label, prcAlcohol, quantity, req.session.id);
                    tempDrinkId = drinks[0].drink_id;
                }

                await consumptionModel.createConsumption(client, date === undefined ? new Date() : date, req.session.id, tempDrinkId);
                await drinkModel.changePopularityByOne(client, tempDrinkId, 1);

                res.sendStatus(201);
                client.query("COMMIT;");
            } else {
                //Sinon on crée la boisson + la consommation
                const {rows: drinks} = await drinkModel.createDrink(client, label, prcAlcohol, quantity, req.session.id);
                tempDrinkId = drinks[0].drink_id;
                await consumptionModel.createConsumption(client, date === undefined ? new Date() : date, req.session.id, tempDrinkId);
                await drinkModel.changePopularityByOne(client, drinkId, 1);
                res.sendStatus(201);
                client.query("COMMIT;");
            }
        } catch (error) {
            client.query("ROLLBACK;");
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.updateConsumption = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {consumptionId, date} = req.body;
        const client = await pool.connect();

        try {
            await consumptionModel.updateConsumption(client, consumptionId, date);
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getAllConsumptionsByUserId = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: consumptionsEntities} = await consumptionModel.getAllConsumptionsByUserId(client, req.session.id);

        if (consumptionsEntities[0] !== undefined) {
            const consumptions = [];
            consumptionsEntities.forEach(function(c) {
                consumptions.push(dto.consumptionDTO(c));
            });
            res.json(consumptions);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

// module.exports.getAllConsumptionsByDate = async (req, res) => {
//     const {date} = req.body;
//
//     if (date === undefined) {
//         res.status(400).json({error: error.INVALID_PARAMETER});
//     } else {
//         const client = await pool.connect();
//
//         try {
//             const {rows: consumptionsEntities} = await consumptionModel.getAllConsumptionsByDate(client, date);
//
//             if (consumptionsEntities[0] !== undefined) {
//                 const consumptions = [];
//                 consumptionsEntities.forEach(function(c) {
//                     consumptions.push(dto.consumptionDTO(c));
//                 });
//                 res.json(consumptions);
//             } else {
//                 res.status(404).json({error: [error.CONSUMPTION_NOT_FOUND]});
//             }
//         } catch (error) {
//             console.log(error);
//             res.sendStatus(500);
//         } finally {
//             client.release();
//         }
//     }
// }

module.exports.deleteConsumption = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const consumptionIdTexte = req.params.id;
        const consumptionId = parseInt(consumptionIdTexte);
        const client = await pool.connect();

        try {
            client.query("BEGIN;");
            const {rows: consumptionsEntities} = await consumptionModel.getConsumptionByConsumptionIdAndUserId(client, consumptionId, req.session.id);

            if (consumptionsEntities[0] !== undefined) {
                await consumptionModel.deleteConsumption(client, consumptionId);
                await drinkModel.changePopularityByOne(client, consumptionsEntities[0].drink_id, -1);
                res.sendStatus(204);
                client.query("COMMIT;");
            } else {
                res.status(404).json({error: [error.CONSUMPTION_NOT_FOUND]});
            }
        } catch (error) {
            client.query("ROLLBACK;");
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getAlcoholLevel = async (req, res) => {
    const userIdTexte = req.params.userId;
    const userId = parseInt(userIdTexte);
    const client = await pool.connect();

    // res.json({
    //     totalAlcoholLevel: Math.random(),
    //     actualAlcoholLevel: Math.random(),
    //     timeLeftBeforeAbsorption: Math.random()
    // });

    try {
        const {rows: usersEntities} = await userModel.getUser(client, userId);

        if (usersEntities[0] !== undefined) {
            const userEntity = usersEntities[0];
            var today = new Date();
            let twoDaysBeforeToday = new Date(today.getTime());
            twoDaysBeforeToday.setDate(today.getDate() - 2);

            const {rows: consumptionsEntities} = await consumptionModel.getAllConsumptionsAfterDate(client, userId, twoDaysBeforeToday);

            if (consumptionsEntities[0] !== undefined) {
                const user = dto.userDTO(userEntity);
                let consumption;
                let looseAlcohol = false;
                let totalAlcohol = 0;
                let minutesForEliminateDrink = 0;
                let minutesLeftForEliminateDrink = 0;
                let minutesFromLoosingAlcohol = 0;
                let totalAlcoholLost = 0;
                let alcoholLevelDrink = 0;
                let minutesSinceConsumption = 0;
                let alcoholLevelActual = 0;
                let actualLevel;
                let iFirstDrinkToEliminate = 0;
                let drinksToEliminate = [];
                let iDrink = 0;

                consumptionsEntities.forEach(function (c) {
                    consumption = dto.consumptionDTO(c);

                    if (consumption.drink.prcAlcohol > 0) {
                        alcoholLevelDrink = (((consumption.drink.quantity * 1000) * (consumption.drink.prcAlcohol / 100) * 0.8) / ((user.gender === constant.GENDER_MAN ? 0.7 : 0.6) * user.weight));
                        minutesSinceConsumption = (new Date() - consumption.date) / (1000 * 60);
                        alcoholLevelActual = alcoholLevelDrink * (minutesSinceConsumption / constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL);
                        minutesForEliminateDrink = alcoholLevelDrink / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
                        //Verifier si elle a déjà été éliminée
                        minutesLeftForEliminateDrink = minutesForEliminateDrink + (constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL - minutesSinceConsumption);

                        alcoholLevelActual = alcoholLevelDrink * (minutesSinceConsumption / constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL);

                        if (minutesLeftForEliminateDrink > 0) {
                            if (alcoholLevelActual > alcoholLevelDrink) {
                                looseAlcohol = true;
                                drinksToEliminate.push(iDrink);
                                totalAlcohol += alcoholLevelDrink;
                            } else {
                                totalAlcohol += alcoholLevelActual;
                            }
                        }
                    }

                    iDrink++
                });

                if (looseAlcohol) {
                    // minutesSinceLoosing = (new Date() / (1000 * 60)) - minutesFromLoosingAlcohol;
                    minutesFromLoosingAlcohol = (new Date() - consumptionsEntities[drinksToEliminate[0]].date) / (1000 * 60) - constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL;
                    totalAlcoholLost = minutesFromLoosingAlcohol * ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
                }

                alcoholLevelDrink = totalAlcohol - totalAlcoholLost;

                if (alcoholLevelDrink > 0) {
                    res.json({
                        totalAlcoholLevel: totalAlcohol,
                        actualAlcoholLevel: alcoholLevelDrink,
                        timeLeftBeforeAbsorption: 0
                        // timeLeftBeforeAbsorption: minutesMaxConvert.toISOString().substr(11, 8)
                    });
                } else {
                    res.json({
                        totalAlcoholLevel: 0,
                        actualAlcoholLevel: 0,
                        timeLeftBeforeAbsorption: 0
                        // timeLeftBeforeAbsorption: minutesMaxConvert.toISOString().substr(11, 8)
                    });
                }
            } else {
                res.json({
                    totalAlcoholLevel: 0,
                    actualAlcoholLevel: 0,
                    timeLeftBeforeAbsorption: 0
                    // timeLeftBeforeAbsorption: minutesMaxConvert.toISOString().substr(11, 8)
                });
            }
        } else {
            res.status(404).json({error: [error.USER_NOT_FOUND]});
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.consumptionExists = async (id) => {
    const client = await pool.connect();

    try {
        return await consumptionModel.consumptionExists(client, id);
    } catch (error){
        res.sendStatus(500);
    } finally {
        client.release();
    }
}





// try {
//     const {rows: usersEntities} = await userModel.getUser(client, userId);
//
//     if (usersEntities[0] !== undefined) {
//         const userEntity = usersEntities[0];
//         var today = new Date();
//         let twoDaysBeforeToday = new Date(today.getTime());
//         twoDaysBeforeToday.setDate(today.getDate() - 2);
//
//         const {rows: consumptionsEntities} = await consumptionModel.getAllConsumptionsAfterDate(client, userId, twoDaysBeforeToday);
//         var alcoholLevelNetMax = 0;
//         let alcoholLevelNetMin = 0;
//         let minutesLeftForEliminateDrink;
//         let totalMinutesLeftBeforeAbsorption = 0;
//
//         if (consumptionsEntities[0] !== undefined) {
//             const user = dto.userDTO(userEntity);
//             let alcoholLevelDrink;
//             let consumption;
//             let minutesForEliminateDrink;
//             let minutesSinceConsumption;
//             let alcoholLevelActual;
//             var totalAlcoholLevel = 0;
//             let nbConsumptionsActives = 0;
//             let minutesFromConst;
//
//             consumptionsEntities.forEach(function (c) {
//                 consumption = dto.consumptionDTO(c);
//
//                 if (consumption.drink.prcAlcohol > 0) {
//                     alcoholLevelDrink = (((consumption.drink.quantity * 1000) * (consumption.drink.prcAlcohol / 100) * 0.8) / ((user.gender === constant.GENDER_MAN ? 0.7 : 0.6) * user.weight));
//                     minutesForEliminateDrink = alcoholLevelDrink / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
//
//                     minutesSinceConsumption = (new Date() - consumption.date) / (1000 * 60);
//                     minutesLeftForEliminateDrink = minutesForEliminateDrink + (constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL - minutesSinceConsumption);
//
//                     alcoholLevelActual = alcoholLevelDrink * (minutesSinceConsumption / constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL);
//
//                     if (minutesLeftForEliminateDrink > 0) {
//                         if (alcoholLevelActual > alcoholLevelDrink) {
//                             //Le taux diminiue
//                             alcoholLevelNetMax += minutesLeftForEliminateDrink * ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
//                         } else {
//                             //Le taux augmente
//                             alcoholLevelNetMax += alcoholLevelActual;
//                         }
//                         totalMinutesLeftBeforeAbsorption += minutesLeftForEliminateDrink;
//                         totalAlcoholLevel += alcoholLevelDrink;
//
//                         nbConsumptionsActives++;
//                     }
//                 }
//             });
//
//             var minutesMaxConvert = new Date(0);
//             minutesMaxConvert.setMinutes(Math.trunc(totalMinutesLeftBeforeAbsorption), (totalMinutesLeftBeforeAbsorption % 1) * 60);
//
//             res.json({
//                 totalAlcoholLevel: totalAlcoholLevel,
//                 actualAlcoholLevel: alcoholLevelNetMax,
//                 timeLeftBeforeAbsorption: minutesMaxConvert.toISOString().substr(11, 8)
//             });
//
//
//             // if (consumptionsEntities[0] !== undefined) {
            //     const user = dto.userDTO(userEntity);
            //     let alcoholLevelDrink;
            //     let consumption;
            //     let minutesForEliminateDrink;
            //     let minutesSinceConsumption;
            //     let alcoholLevelActual;
            //     var totalAlcoholLevel = 0;
            //     let nbConsumptionsActives = 0;
            //     let minutesFromConst;
            //     let minutesLeftBeforeDrinkTotalAbsorption
            //
            //     consumptionsEntities.forEach(function (c) {
            //         consumption = dto.consumptionDTO(c);
            //
            //         if (consumption.drink.prcAlcohol > 0) {
            //             alcoholLevelDrink = (((consumption.drink.quantity * 1000) * (consumption.drink.prcAlcohol / 100) * 0.8) / ((user.gender === constant.GENDER_MAN ? 0.7 : 0.6) * user.weight));
            //
            //             minutesForEliminateDrink = alcoholLevelDrink / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
            //             minutesSinceConsumption = (new Date() - consumption.date) / (1000 * 60);
            //             minutesLeftBeforeDrinkTotalAbsorption = minutesForEliminateDrink - minutesSinceConsumption + constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL;
            //             //Si la ligne du dessus est négative alors la boisson a déjà été absorbée
            //
            //             if (minutesLeftBeforeDrinkTotalAbsorption > 0) {
            //                 alcoholLevelActual = alcoholLevelDrink * (minutesSinceConsumption / constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL);
            //
            //                 if (alcoholLevelActual >= alcoholLevelDrink) {
            //                     //Le taux diminiue
            //                     alcoholLevelNetMax += (alcoholLevelDrink - ((minutesSinceConsumption - constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL) * ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60)));
            //                 } else {
            //                     //Le taux augmente
            //                     alcoholLevelNetMax += alcoholLevelActual;
            //                     //alcoholLevelNetMax += alcoholLevelActual / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
            //                 }
            //                 totalMinutesLeftBeforeAbsorption += minutesLeftBeforeDrinkTotalAbsorption;
            //                 totalAlcoholLevel += alcoholLevelDrink;
            //
            //                 // minutesFromConst = minutesSinceConsumption - constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL;
            //                 // if (minutesFromConst < 0) {
            //                 //     totalMinutesLeftBeforeAbsorption += minutesFromConst;
            //                 // }
            //                 // totalMinutesLeftBeforeAbsorption += minutesForEliminateDrink;
            //
            //                 nbConsumptionsActives++;
            //             }
            //         }
            //     });
            //
            //     var minutesMaxConvert = new Date(0);
            //     minutesMaxConvert.setMinutes(Math.trunc(totalMinutesLeftBeforeAbsorption), (totalMinutesLeftBeforeAbsorption % 1) * 60);
            //
            // } else {
            //     res.json({
            //         totalAlcoholLevel: 0,
//             //         actualAlcoholLevel: 0,
//             //         timeLeftBeforeAbsorption: 0
//             //     });
//             // }
//         } else {
//             res.sendStatus(404);
//         }
//         // if (Date.parse(today) >= (Date.parse(d) + (1000 * i)) && totalAlcoholLevel !== undefined && actualAlcoholLevel !== undefined && timeLeftBeforeAbsorption !== undefined) {
//         //     console.log({
//         //         totalAlcoholLevel: totalAlcoholLevel,
//         //         actualAlcoholLevel: alcoholLevelNetMax,
//         //         timeLeftBeforeAbsorption: minutesMaxConvert.toISOString().substr(11, 8)
//         //     });
//         //     i++;
//         // }
//     } else {
//         res.status(404).json({error: [error.USER_NOT_FOUND]});
//     }
// } catch (error) {
//     console.log(error);
//     res.sendStatus(500);
// } finally {
//     client.release();
// }