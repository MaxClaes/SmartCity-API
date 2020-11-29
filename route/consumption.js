const JWTMiddleWare = require("../middleware/IdentificationJWT");
const consumptionController = require('../controleur/consumptionDB');
const validatorUser = require('../middleware/ValidatorUser');

const Router = require("express-promise-router");
const router = new Router;

router.post('/:drinkId', JWTMiddleWare.identification, validatorDrink.drinkExists, consumptionController.createConsumption);
router.patch('/', JWTMiddleWare.identification, consumptionController.updateConsumption);
router.get('/', JWTMiddleWare.identification, consumptionController.getAllConsumptionByUserId);
router.get('/date', JWTMiddleWare.identification, consumptionController.getAllConsumptionByDate);
router.delete('/:drinkId', JWTMiddleWare.identification, consumptionController.deleteConsumption);
router.get('/alcohollevel', JWTMiddleWare.identification, consumptionController.getAlcoholLevel);

module.exports = router;
