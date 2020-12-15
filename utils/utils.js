const userModel = require("../model/userDB");

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.getHash = (string) => bcrypt.hash(string, saltRounds);

module.exports.compareHash = (string, hash) => bcrypt.compare(string, hash);

// module.exports.getAlcoholLevel = async (userId) => {
//     const client = await pool.connect();
//
//
//
//     try {
//         const {rows: usersEntities} = await userModel.getUser(client, userId);
//         return({
//             totalAlcoholLevel: 0,
//             actualAlcoholLevel: 0,
//             timeLeftBeforeAbsorption: 0
//         });
//     } catch (e) {
//         console.log(e);
//     } finally {
//         client.release();
//     }
//
//
//     // let i = 0;
//     // let r = [];
//     // let t;
//     // let d = new Date();
//
//
//     // try {
//     // const {rows: usersEntities} = await userModel.getUser(client, id);
//     // const userEntity = usersEntities[0];
//     //
//     // if (userEntity !== undefined) {
//     //     var today = new Date();
//     //     let twoDaysBeforeToday = new Date(today.getTime());
//     //     twoDaysBeforeToday.setDate(today.getDate() - 2);
//     //
//     //     const {rows: consumptionsEntities} = await consumptionModel.getAllConsumptionsAfterDate(client, id, twoDaysBeforeToday);
//     //     var alcoholLevelNetMax = 0;
//     //     let alcoholLevelNetMin = 0;
//     //     let minutesLeftBeforeDrinkAbsorption;
//     //     let totalMinutesLeftBeforeAbsorption = 0;
//     //
//     //     if (consumptionsEntities[0] !== undefined) {
//     //         const user = dto.userDTO(userEntity);
//     //         let alcoholLevelDrink;
//     //         let consumption;
//     //         let minutesForEliminateDrink;
//     //         let minutesSinceConsumption;
//     //         let alcoholLevelActual;
//     //         var totalAlcoholLevel = 0;
//     //         let nbConsumptionsActives = 0;
//     //         let minutesFromConst;
//     //
//     //         consumptionsEntities.forEach(function (c) {
//     //             consumption = dto.consumptionDTO(c);
//     //
//     //             if (consumption.drink.prcAlcohol > 0) {
//     //                 alcoholLevelDrink = (((consumption.drink.quantity * 1000) * (consumption.drink.prcAlcohol / 100) * 0.8) / ((user.gender === constant.GENDER_MAN ? 0.7 : 0.6) * user.weight));
//     //
//     //                 // minutesForEliminateDrink = constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL + (alcoholLevelDrink / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60));
//     //                 // minutesSinceConsumption = (new Date() - consumption.date) / (1000 * 60);
//     //                 // minutesLeftBeforeDrinkAbsorption = minutesForEliminateDrink - minutesSinceConsumption;
//     //                 minutesForEliminateDrink = alcoholLevelDrink / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
//     //                 minutesSinceConsumption = (new Date() - consumption.date) / (1000 * 60);
//     //                 minutesLeftBeforeDrinkAbsorption = minutesForEliminateDrink - minutesSinceConsumption + constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL;
//     //
//     //                 alcoholLevelActual = alcoholLevelDrink * (minutesSinceConsumption / constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL);
//     //
//     //                 if (minutesLeftBeforeDrinkAbsorption > 0) {
//     //                     if (alcoholLevelActual > alcoholLevelDrink) {
//     //                         //Le taux diminiue
//     //                         alcoholLevelNetMax += minutesLeftBeforeDrinkAbsorption * ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
//     //                     } else {
//     //                         //Le taux augmente
//     //                         alcoholLevelNetMax += alcoholLevelActual;
//     //                         //alcoholLevelNetMax += alcoholLevelActual / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
//     //                     }
//     //                     totalMinutesLeftBeforeAbsorption += minutesLeftBeforeDrinkAbsorption;
//     //                     totalAlcoholLevel += alcoholLevelDrink;
//     //
//     //                     // minutesFromConst = minutesSinceConsumption - constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL;
//     //                     // if (minutesFromConst < 0) {
//     //                     //     totalMinutesLeftBeforeAbsorption += minutesFromConst;
//     //                     // }
//     //                     // totalMinutesLeftBeforeAbsorption += minutesForEliminateDrink;
//     //
//     //                     nbConsumptionsActives++;
//     //                 }
//     //             }
//     //         });
//     //
//     //         //totalMinutesLeftBeforeAbsorption = totalMinutesLeftBeforeAbsorption / nbConsumptionsActives;
//     //         var minutesMaxConvert = new Date(0);
//     //         minutesMaxConvert.setMinutes(Math.trunc(totalMinutesLeftBeforeAbsorption), (totalMinutesLeftBeforeAbsorption % 1) * 60);
//     //
//     //         res.json({
//     //             totalAlcoholLevel: totalAlcoholLevel,
//     //             actualAlcoholLevel: alcoholLevelNetMax,
//     //             timeLeftBeforeAbsorption: minutesMaxConvert.toISOString().substr(11, 8)
//     //         });
//     //
//     //
//     //         // if (consumptionsEntities[0] !== undefined) {
//     //         //     const user = dto.userDTO(userEntity);
//     //         //     let alcoholLevelDrink;
//     //         //     let consumption;
//     //         //     let minutesForEliminateDrink;
//     //         //     let minutesSinceConsumption;
//     //         //     let alcoholLevelActual;
//     //         //     var totalAlcoholLevel = 0;
//     //         //     let nbConsumptionsActives = 0;
//     //         //     let minutesFromConst;
//     //         //     let minutesLeftBeforeDrinkTotalAbsorption
//     //         //
//     //         //     consumptionsEntities.forEach(function (c) {
//     //         //         consumption = dto.consumptionDTO(c);
//     //         //
//     //         //         if (consumption.drink.prcAlcohol > 0) {
//     //         //             alcoholLevelDrink = (((consumption.drink.quantity * 1000) * (consumption.drink.prcAlcohol / 100) * 0.8) / ((user.gender === constant.GENDER_MAN ? 0.7 : 0.6) * user.weight));
//     //         //
//     //         //             minutesForEliminateDrink = alcoholLevelDrink / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
//     //         //             minutesSinceConsumption = (new Date() - consumption.date) / (1000 * 60);
//     //         //             minutesLeftBeforeDrinkTotalAbsorption = minutesForEliminateDrink - minutesSinceConsumption + constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL;
//     //         //             //Si la ligne du dessus est négative alors la boisson a déjà été absorbée
//     //         //
//     //         //             if (minutesLeftBeforeDrinkTotalAbsorption > 0) {
//     //         //                 alcoholLevelActual = alcoholLevelDrink * (minutesSinceConsumption / constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL);
//     //         //
//     //         //                 if (alcoholLevelActual >= alcoholLevelDrink) {
//     //         //                     //Le taux diminiue
//     //         //                     alcoholLevelNetMax += (alcoholLevelDrink - ((minutesSinceConsumption - constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL) * ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60)));
//     //         //                 } else {
//     //         //                     //Le taux augmente
//     //         //                     alcoholLevelNetMax += alcoholLevelActual;
//     //         //                     //alcoholLevelNetMax += alcoholLevelActual / ((user.gender === constant.GENDER_MAN ? constant.ALCOHOL_MOY_ELIMINATION_SPEED_MAN : constant.ALCOHOL_MOY_ELIMINATION_SPEED_WOMAN) / 60);
//     //         //                 }
//     //         //                 totalMinutesLeftBeforeAbsorption += minutesLeftBeforeDrinkTotalAbsorption;
//     //         //                 totalAlcoholLevel += alcoholLevelDrink;
//     //         //
//     //         //                 // minutesFromConst = minutesSinceConsumption - constant.ALCOHOL_TIME_MOY_HIGHEST_LEVEL;
//     //         //                 // if (minutesFromConst < 0) {
//     //         //                 //     totalMinutesLeftBeforeAbsorption += minutesFromConst;
//     //         //                 // }
//     //         //                 // totalMinutesLeftBeforeAbsorption += minutesForEliminateDrink;
//     //         //
//     //         //                 nbConsumptionsActives++;
//     //         //             }
//     //         //         }
//     //         //     });
//     //         //
//     //         //     var minutesMaxConvert = new Date(0);
//     //         //     minutesMaxConvert.setMinutes(Math.trunc(totalMinutesLeftBeforeAbsorption), (totalMinutesLeftBeforeAbsorption % 1) * 60);
//     //         //
//     //         // } else {
//     //         //     res.json({
//     //         //         totalAlcoholLevel: 0,
//     //         //         actualAlcoholLevel: 0,
//     //         //         timeLeftBeforeAbsorption: 0
//     //         //     });
//     //         // }
//     //     } else {
//     //         res.sendStatus(404);
//     //     }
//     //     // if (Date.parse(today) >= (Date.parse(d) + (1000 * i)) && totalAlcoholLevel !== undefined && actualAlcoholLevel !== undefined && timeLeftBeforeAbsorption !== undefined) {
//     //     //     console.log({
//     //     //         totalAlcoholLevel: totalAlcoholLevel,
//     //     //         actualAlcoholLevel: alcoholLevelNetMax,
//     //     //         timeLeftBeforeAbsorption: minutesMaxConvert.toISOString().substr(11, 8)
//     //     //     });
//     //     //     i++;
//     //     // }
//     // }
//     //
//     // } catch (error) {
//     //     console.log(error);
//     //     res.sendStatus(500);
//     // } finally {
//     //     client.release();
//     // }
//
// }