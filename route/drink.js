const JWTMiddleWare = require("../middleware/IdentificationJWT");
const drinkControleur = require("../controleur/drinkDB");
const validatorDrink = require("../middleware/drink/Validator");
const validatorUser = require("../middleware/user/Validator");
const authorizationDrink = require("../middleware/drink/Authorization");
const authorizationUser = require("../middleware/user/Authorization");
const validatorUtil = require("../middleware/ValidatorUtil");

const Router = require("express-promise-router");
const router = new Router;

router.get('/', JWTMiddleWare.identification, drinkControleur.getAllDrinks);
router.get('/name/:label', JWTMiddleWare.identification, validatorDrink.labelValidation,drinkControleur.getDrinksByName);
router.get('/user/:userId', JWTMiddleWare.identification, validatorUser.userIdValidation, authorizationUser.mustBeManagerOrCreator, drinkControleur.getDrinksByCreatedBy);
router.post('/', JWTMiddleWare.identification, validatorDrink.createModifyDrinkValidation, drinkControleur.createDrink);
router.patch('/:drinkId', JWTMiddleWare.identification, validatorDrink.drinkIdValidation, validatorDrink.createModifyDrinkValidation, authorizationDrink.canModifyOrDeleteDrink, drinkControleur.updateDrink);
router.delete('/:drinkId', JWTMiddleWare.identification, validatorDrink.drinkIdValidation, authorizationDrink.canModifyOrDeleteDrink, drinkControleur.deleteDrink);
router.patch('/:drinkId/report/reset', JWTMiddleWare.identification, validatorDrink.drinkIdValidation, authorizationUser.mustBeManager, drinkControleur.resetReport);
router.patch('/:drinkId/report/increment', JWTMiddleWare.identification, validatorDrink.drinkIdValidation, drinkControleur.incrementReport);

module.exports = router;
