const AuthoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const BoissonControleur = require("../controleur/boissonDB");

const Router = require("express-promise-router");
const router = new Router;

router.get('/', BoissonControleur.getAllBoissons);
router.get('/:label', BoissonControleur.getBoissonByName);
router.post('/', JWTMiddleWare.identification, BoissonControleur.createBoisson);
router.patch('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeManagerOrCreator, BoissonControleur.updateBoisson);

module.exports = router;
