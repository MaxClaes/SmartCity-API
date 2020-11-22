const AuthoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const ReportControleur = require("../controleur/reportDB");

const Router = require("express-promise-router");
const router = new Router;

router.patch('/reset/:drinkId', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, ReportControleur.resetReport);
router.patch('/increment/:drinkId', JWTMiddleWare.identification, ReportControleur.incrementReport);

module.exports = router;
