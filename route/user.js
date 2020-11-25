const AuthoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const UserController = require('../controleur/userDB');

const Router = require("express-promise-router");
const router = new Router;

router.post('/login', UserController.login);
router.post('/registration', UserController.createUser);
router.get('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, UserController.getAllUsers);
router.get('/:id', JWTMiddleWare.identification, AuthoMiddleware.mustBeManagerOrCreator, UserController.getUser);
router.patch('/update', JWTMiddleWare.identification, UserController.updateUser);
router.patch('/role', JWTMiddleWare.identification, AuthoMiddleware.canChangeRole, UserController.changeRole)
//Route pour faire un modify du password uniquement si on demande le password de la personne connecté

module.exports = router;
