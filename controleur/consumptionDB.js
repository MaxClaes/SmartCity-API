const consumptionModel = require("../model/consumptionDB");
const userModel = require("../model/userDB");
const drinkModel = require("../model/drinkDB");
const pool = require("../model/database");
const constant = require('../utils/constant');
const dto = require('../dto');
const error = require('../error/index');

module.exports.createConsumption = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()});
    } else {
        const {date} = req.body;
        const drinkIdTexte = req.params.drinkId;
        const drinkId = parseInt(drinkIdTexte);
        const client = await pool.connect();

        try {
            client.query("BEGIN;");
            if (await drinkModel.drinkExists(client, drinkId)) {
                await consumptionModel.createConsumption(client, date === undefined ? new Date() : date, req.session.id, drinkId);
                res.sendStatus(201);
                client.query("COMMIT;");
            } else {
                res.status(404).json({error: error.DRINK_NOT_FOUND});
                client.query("ROLLBACK;");
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
            res.status(404).json({error: error.CONSUMPTION_NOT_FOUND});
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
//                 res.status(404).json({error: error.CONSUMPTION_NOT_FOUND});
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
            await consumptionModel.deleteConsumption(client, consumptionId);
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getAlcoholLevel = async (req, res) => {
    const client = await pool.connect();


    let i = 0;
    let r = [];
    let t;
    let d = new Date();


    try {
        while (1 === 1) {
            const {rows: usersEntities} = await userModel.getUser(client, req.session.id);
            const userEntity = usersEntities[0];

            if (userEntity !== undefined) {
                var today = new Date();
                let twoDaysBeforeToday = new Date(today.getTime());
                twoDaysBeforeToday.setDate(today.getDate() - 2);

                const {rows: consumptionsEntities} = await consumptionModel.getAllConsumptionsAfterDate(client, req.session.id, twoDaysBeforeToday);
                var alcoholLevelNetMax = 0;
                let alcoholLevelNetMin = 0;
                let minutesLeftBeforeDrinkAbsorption;
                let totalMinutesLeftBeforeAbsorption = 0;

                // if (consumptionsEntities[0] !== undefined) {
                //     const user = dto.userDTO(userEntity);
                //     let alcoholLevelDrink;
                //     let consumption;
                //     let minutesForEliminateDrink;
                //     let minutesSinceConsumption;
                //     let alcoholLevelActual;
                //     var totalAlcoholLevel = 0;
                //     let nbConsumptionsActives = 0;
                //     let minutesFromConst;
                //
                //     consumptionsEntities.forEach(function (c) {
                //         consumption = dto.consumptionDTO(c);
                //
                //         if (consumption.drink.prcAlcohol > 0) {
                //             alcoholLevelDrink = (((consumption.drink.quantity * 1000) * (consumption.drink.prcAlcohol / 100) * 0.8) / ((user.gender === constant.GENDER_MAN ? 0.7 : 0.6) * user.weight));
                //
                //             // minutesForEliminateDrink = constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL + (alcoholLevelDrink / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60));
                //             // minutesSinceConsumption = (new Date() - consumption.date) / (1000 * 60);
                //             // minutesLeftBeforeDrinkAbsorption = minutesForEliminateDrink - minutesSinceConsumption;
                //             minutesForEliminateDrink = alcoholLevelDrink / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
                //             minutesSinceConsumption = (new Date() - consumption.date) / (1000 * 60);
                //             minutesLeftBeforeDrinkAbsorption = minutesForEliminateDrink - minutesSinceConsumption + constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL;
                //
                //             alcoholLevelActual = alcoholLevelDrink * (minutesSinceConsumption / constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL);
                //
                //             if (minutesLeftBeforeDrinkAbsorption > 0) {
                //                 if (alcoholLevelActual > alcoholLevelDrink) {
                //                     //Le taux diminiue
                //                     alcoholLevelNetMax += minutesLeftBeforeDrinkAbsorption * ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
                //                 } else {
                //                     //Le taux augmente
                //                     alcoholLevelNetMax += alcoholLevelActual;
                //                     //alcoholLevelNetMax += alcoholLevelActual / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
                //                 }
                //                 totalMinutesLeftBeforeAbsorption += minutesLeftBeforeDrinkAbsorption;
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
                //     //totalMinutesLeftBeforeAbsorption = totalMinutesLeftBeforeAbsorption / nbConsumptionsActives;
                //     var minutesMaxConvert = new Date(0);
                //     minutesMaxConvert.setMinutes(Math.trunc(totalMinutesLeftBeforeAbsorption), (totalMinutesLeftBeforeAbsorption % 1) * 60);
                //
                //     // res.json({
                //     //     totalAlcoholLevel: totalAlcoholLevel,
                //     //     actualAlcoholLevel: alcoholLevelNetMax,
                //     //     timeLeftBeforeAbsorption: minutesMaxConvert.toISOString().substr(11, 8)
                //     // });
                //

                if (consumptionsEntities[0] !== undefined) {
                    const user = dto.userDTO(userEntity);
                    let alcoholLevelDrink;
                    let consumption;
                    let minutesForEliminateDrink;
                    let minutesSinceConsumption;
                    let alcoholLevelActual;
                    var totalAlcoholLevel = 0;
                    let nbConsumptionsActives = 0;
                    let minutesFromConst;
                    let minutesLeftBeforeDrinkTotalAbsorption

                    consumptionsEntities.forEach(function (c) {
                        consumption = dto.consumptionDTO(c);

                        if (consumption.drink.prcAlcohol > 0) {
                            alcoholLevelDrink = (((consumption.drink.quantity * 1000) * (consumption.drink.prcAlcohol / 100) * 0.8) / ((user.gender === constant.GENDER_MAN ? 0.7 : 0.6) * user.weight));

                            minutesForEliminateDrink = alcoholLevelDrink / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
                            minutesSinceConsumption = (new Date() - consumption.date) / (1000 * 60);
                            minutesLeftBeforeDrinkTotalAbsorption = minutesForEliminateDrink - minutesSinceConsumption + constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL;
                            //Si la ligne du dessus est négative alors la boisson a déjà été absorbée

                            if (minutesLeftBeforeDrinkTotalAbsorption > 0) {
                                alcoholLevelActual = alcoholLevelDrink * (minutesSinceConsumption / constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL);

                                if (alcoholLevelActual >= alcoholLevelDrink) {
                                    //Le taux diminiue
                                    alcoholLevelNetMax += (alcoholLevelDrink - ((minutesSinceConsumption - constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL) * ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60)));
                                } else {
                                    //Le taux augmente
                                    alcoholLevelNetMax += alcoholLevelActual;
                                    //alcoholLevelNetMax += alcoholLevelActual / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
                                }
                                totalMinutesLeftBeforeAbsorption += minutesLeftBeforeDrinkTotalAbsorption;
                                totalAlcoholLevel += alcoholLevelDrink;

                                // minutesFromConst = minutesSinceConsumption - constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL;
                                // if (minutesFromConst < 0) {
                                //     totalMinutesLeftBeforeAbsorption += minutesFromConst;
                                // }
                                // totalMinutesLeftBeforeAbsorption += minutesForEliminateDrink;

                                nbConsumptionsActives++;
                            }
                        }
                    });

                    var minutesMaxConvert = new Date(0);
                    minutesMaxConvert.setMinutes(Math.trunc(totalMinutesLeftBeforeAbsorption), (totalMinutesLeftBeforeAbsorption % 1) * 60);

                } else {
                    res.json({
                        totalAlcoholLevel: 0,
                        actualAlcoholLevel: 0,
                        timeLeftBeforeAbsorption: 0
                    });
                }
            } else {
                res.sendStatus(404);
            }
            if (Date.parse(today) >= (Date.parse(d) + (1000 * i))) {
                console.log({
                    totalAlcoholLevel: totalAlcoholLevel,
                    actualAlcoholLevel: alcoholLevelNetMax,
                    timeLeftBeforeAbsorption: minutesMaxConvert.toISOString().substr(11, 8)
                });
                i++;
            }
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
