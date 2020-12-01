const JWTMiddleWare = require("../middleware/IdentificationJWT");
const consumptionController = require("../controleur/consumptionDB");
const validatorConsumption = require("../middleware/consumption/ValidatorConsumption");

const Router = require("express-promise-router");
const router = new Router;

router.post('/:id', JWTMiddleWare.identification, validatorConsumption.createConsumptionValidation, consumptionController.createConsumption);
router.patch('/', JWTMiddleWare.identification, validatorConsumption.updateConsumptionValidation, consumptionController.updateConsumption);
router.get('/', JWTMiddleWare.identification, consumptionController.getAllConsumptionsByUserId);
//router.get('/date', JWTMiddleWare.identification, consumptionController.getAllConsumptionsByDate);
router.delete('/:id', JWTMiddleWare.identification, validatorConsumption.deleteConsumptionValidation, consumptionController.deleteConsumption);
router.get('/alcohollevel', JWTMiddleWare.identification, consumptionController.getAlcoholLevel);

module.exports = router;
