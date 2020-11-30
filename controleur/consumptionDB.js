const consumptionModel = require("../model/consumptionDB");
const pool = require("../model/database");
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

module.exports.getAllConsumptionByUserId = async (req, res) => {
    const client = await pool.connect();

    try {
        const {rows: consumptionsEntities} = await consumptionModel.getAllConsumptionByUserId(client, req.session.id);

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

// module.exports.getAllConsumptionByDate = async (req, res) => {
//     const {date} = req.body;
//
//     if (date === undefined) {
//         res.status(400).json({error: error.INVALID_PARAMETER});
//     } else {
//         const client = await pool.connect();
//
//         try {
//             const {rows: consumptionsEntities} = await consumptionModel.getAllConsumptionByDate(client, date);
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

}
