const consumptionModel = require("../model/consumptionDB");
const userModel = require("../model/userDB");
const pool = require("../model/database");
const constant = require('../utils/constant');
const dto = require('../dto');
const error = require('../error/index');

module.exports.createConsumption = async (req, res) => {
    const {date} = req.body;
    const drinkId = req.params.drinkId;
    const client = await pool.connect();

    try {
        await consumptionModel.createConsumption(client, date === undefined ? new Date() : date, req.session.id, drinkId);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.updateConsumption = async (req, res) => {
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
    const consumptionIdTexte = req.params.consumptionId;
    const consumptionId = parseInt(consumptionIdTexte);

    if (isNaN(consumptionId)) {
        res.status(400).json({error: error.INVALID_PARAMETER});
    } else {
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

    try {
        const {rows: usersEntities} = await userModel.getUser(client, req.session.id);
        const userEntity = usersEntities[0];

        if(userEntity !== undefined) {
            let today = new Date();
            let twoDaysBeforeToday = new Date(today.getTime());
            twoDaysBeforeToday.setDate(today.getDate() - 2);

            const {rows: consumptionsEntities} = await consumptionModel.getAllConsumptionsAfterDate(client, req.session.id, twoDaysBeforeToday);
            let alcoholLevelNet = 0;
            let timeLeftBeforeAbsorption;
            let totalTimeLeftBeforeAbsorption = 0

            if (consumptionsEntities[0] !== undefined) {
                const user = dto.userDTO(userEntity);
                let alcoholLevelBrut = 0;
                let consumption;
                let timeDrinkEliminated;
                let differenceTodayAndConsumption;
                let alcoholLevelActual;

                consumptionsEntities.forEach(function(c) {
                    consumption = dto.consumptionDTO(c);

                    if (consumption.drink.prcAlcohol > 0) {
                        alcoholLevelBrut = (((consumption.drink.quantity * 1000) * (consumption.drink.prcAlcohol / 100) * 0.8) / ((user.gender === constant.GENDER_MAN ? 0.7 : 0.6) * user.weight));

                        timeDrinkEliminated = constant.ALCOHOL_TIME_MAX_HIGHEST_LEVEL + (alcoholLevelBrut / (constant.ALCOHOL_MIN_ELIMINATION_SPEED_MAN / 60));
                        differenceTodayAndConsumption = (today - consumption.date) / (1000 * 60);
                        timeLeftBeforeAbsorption = timeDrinkEliminated - differenceTodayAndConsumption;
                        alcoholLevelActual = alcoholLevelBrut * (differenceTodayAndConsumption / constant.ALCOHOL_TIME_MAX_HIGHEST_LEVEL);

                        if (timeLeftBeforeAbsorption > 0) {
                            if (alcoholLevelActual > alcoholLevelBrut) {
                                alcoholLevelNet += timeLeftBeforeAbsorption * (constant.ALCOHOL_MIN_ELIMINATION_SPEED_MAN / 60);
                            } else {
                                alcoholLevelNet += alcoholLevelActual;
                            }
                            totalTimeLeftBeforeAbsorption += timeLeftBeforeAbsorption;
                        }
                    }
                });

                res.json(alcoholLevel = {currentAlcoholLevel : alcoholLevelNet, totalTimeLeftBeforeAbsorption : totalTimeLeftBeforeAbsorption});
            } else {
                res.json(alcoholLevel = {currentAlcoholLevel : alcoholLevelNet, totalTimeLeftBeforeAbsorption : totalTimeLeftBeforeAbsorption});
            }
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
