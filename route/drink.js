const AuthoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const DrinkControleur = require("../controleur/drinkDB");

const Router = require("express-promise-router");
const router = new Router;

router.get('/', DrinkControleur.getAllDrinks);
router.get('/name/:label', DrinkControleur.getDrinksByName);
router.get('/user/:id', JWTMiddleWare.identification, AuthoMiddleware.mustBeManagerOrCreator, DrinkControleur.getDrinksByCreatedBy);
router.post('/', JWTMiddleWare.identification, DrinkControleur.createDrink);
router.patch('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeManagerOrCreator, DrinkControleur.updateDrink);
router.delete('/:id', JWTMiddleWare.identification, AuthoMiddleware.canDelete, DrinkControleur.deleteDrink);
router.patch('/:drinkId/report/reset', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, DrinkControleur.resetReport);
router.patch('/:drinkId/report/increment', JWTMiddleWare.identification, DrinkControleur.incrementReport);

module.exports = router;
