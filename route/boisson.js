const AuthoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const BoissonControleur = require("../controleur/boissonDB");

const Router = require("express-promise-router");
const router = new Router;

router.get('/', BoissonControleur.getAllBoissons);
router.get('/:label', BoissonControleur.getBoissonsByName);
router.get('/:userId', JWTMiddleWare.identification, AuthoMiddleware.mustBeManagerOrCreator, BoissonControleur.getBoissonsByUserId);
router.post('/', JWTMiddleWare.identification, BoissonControleur.createBoisson);
router.patch('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeManagerOrCreator, BoissonControleur.updateBoisson);
router.delete('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeManagerOrCreator, BoissonControleur.deleteBoisson);

module.exports = router;
