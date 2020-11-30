const JWTMiddleWare = require("../middleware/IdentificationJWT");
const consumptionController = require('../controleur/consumptionDB');
const validatorDrink = require('../middleware/ValidatorDrink');

const Router = require("express-promise-router");
const router = new Router;

router.post('/:drinkId', JWTMiddleWare.identification, validatorDrink.drinkExists, consumptionController.createConsumption);
router.patch('/', JWTMiddleWare.identification, consumptionController.updateConsumption);
router.get('/', JWTMiddleWare.identification, consumptionController.getAllConsumptionsByUserId);
//router.get('/date', JWTMiddleWare.identification, consumptionController.getAllConsumptionsByDate);
router.delete('/:consumptionId', JWTMiddleWare.identification, consumptionController.deleteConsumption);
router.get('/alcohollevel', JWTMiddleWare.identification, consumptionController.getAlcoholLevel);

module.exports = router;
