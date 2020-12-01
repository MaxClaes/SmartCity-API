const authoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const drinkControleur = require("../controleur/drinkDB");
const validatorDrink = require("../middleware/ValidatorDrink");
const validatorUtil = require("../middleware/ValidatorUtil");

const Router = require("express-promise-router");
const router = new Router;

router.get('/', JWTMiddleWare.identification, drinkControleur.getAllDrinks);
router.get('/name/:label', JWTMiddleWare.identification, validatorDrink.labelValidation,drinkControleur.getDrinksByName);
router.get('/user/:id', JWTMiddleWare.identification, validatorUtil.idValidation, authoMiddleware.mustBeManagerOrCreator, drinkControleur.getDrinksByCreatedBy);
router.post('/', JWTMiddleWare.identification, validatorDrink.createDrinkValidation, drinkControleur.createDrink);
router.patch('/', JWTMiddleWare.identification, validatorUtil.idValidation, validatorDrink.createDrinkValidation, authoMiddleware.canModifyOrDeleteDrink, drinkControleur.updateDrink);
router.delete('/:id', JWTMiddleWare.identification, validatorUtil.idValidation, authoMiddleware.canModifyOrDeleteDrink, drinkControleur.deleteDrink);
router.patch('/:id/report/reset', JWTMiddleWare.identification, validatorUtil.idValidation, authoMiddleware.mustBeManager, drinkControleur.resetReport);
router.patch('/:id/report/increment', JWTMiddleWare.identification, validatorUtil.idValidation, drinkControleur.incrementReport);

module.exports = router;
