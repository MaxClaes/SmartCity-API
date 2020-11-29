const authoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const userController = require('../controleur/userDB');

const Router = require("express-promise-router");
const router = new Router;

router.post('/login', userController.login);
router.post('/registration', userController.createUser);
router.get('/', JWTMiddleWare.identification, authoMiddleware.mustBeManager, userController.getAllUsers);
router.get('/:id', JWTMiddleWare.identification, authoMiddleware.mustBeManagerOrCreator, userController.getUser);
router.patch('/update', JWTMiddleWare.identification, userController.updateUser);
router.patch('/role', JWTMiddleWare.identification, authoMiddleware.canChangeRole, userController.changeRole)
//Route pour faire un modify du password uniquement si on demande le password de la personne connecté

module.exports = router;
