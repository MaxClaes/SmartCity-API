const authoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const drinkControleur = require("../controleur/drinkDB");

const Router = require("express-promise-router");
const router = new Router;

router.get('/', drinkControleur.getAllDrinks);
router.get('/name/:label', drinkControleur.getDrinksByName);
router.get('/user/:id', JWTMiddleWare.identification, authoMiddleware.mustBeManagerOrCreator, drinkControleur.getDrinksByCreatedBy);
router.post('/', JWTMiddleWare.identification, drinkControleur.createDrink);
router.patch('/', JWTMiddleWare.identification, authoMiddleware.mustBeManagerOrCreator, drinkControleur.updateDrink);
router.delete('/:id', JWTMiddleWare.identification, authoMiddleware.canDelete, drinkControleur.deleteDrink);
router.patch('/:drinkId/report/reset', JWTMiddleWare.identification, authoMiddleware.mustBeManager, drinkControleur.resetReport);
router.patch('/:drinkId/report/increment', JWTMiddleWare.identification, drinkControleur.incrementReport);

module.exports = router;
