const JWTMiddleWare = require("../middleware/identification/IdentificationJWT");
const consumptionController = require("../controleur/consumptionDB");
const validatorConsumption = require("../middleware/consumption/ValidatorConsumption");

const Router = require("express-promise-router");
const router = new Router;

const cors = require('cors')
router.use(cors())

router.post('/', JWTMiddleWare.identification, validatorConsumption.createConsumptionValidation, consumptionController.createConsumption);
router.patch('/', JWTMiddleWare.identification, validatorConsumption.updateConsumptionValidation, consumptionController.updateConsumption);
router.get('/', JWTMiddleWare.identification, consumptionController.getAllConsumptionsByUserId);
router.delete('/:id', JWTMiddleWare.identification, validatorConsumption.deleteConsumptionValidation, consumptionController.deleteConsumption);
router.get('/alcohollevel', JWTMiddleWare.identification, consumptionController.getAlcoholLevel);
//router.get('/date', JWTMiddleWare.identification, consumptionController.getAllConsumptionsByDate);

module.exports = router;
