const AuthoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const DrinkControleur = require("../controleur/drinkDB");

const Router = require("express-promise-router");
const router = new Router;

router.get('/', DrinkControleur.getAllDrinks);
router.get('/:label', DrinkControleur.getDrinksByName);
router.get('/:userId', JWTMiddleWare.identification, AuthoMiddleware.mustBeManagerOrCreator, DrinkControleur.getDrinksByUserId);
router.post('/', JWTMiddleWare.identification, DrinkControleur.createDrink);
router.patch('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeManagerOrCreator, DrinkControleur.updateDrink);
router.delete('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeManagerOrCreator, DrinkControleur.deleteDrink);

module.exports = router;
