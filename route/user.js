const authoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const userController = require("../controleur/userDB");
const validatorUser = require("../middleware/user/Validator");
const authorizationUser = require("../middleware/user/Authorization");

const Router = require("express-promise-router");
const router = new Router;

router.post('/login', validatorUser.loginValidation, userController.login);
router.post('/registration', validatorUser.userRegistrationValidation, userController.createUser);
router.get('/', JWTMiddleWare.identification, authoMiddleware.mustBeManager, userController.getAllUsers);
router.get('/:userId', JWTMiddleWare.identification, validatorUser.userIdValidation, authoMiddleware.mustBeManagerOrCreator, userController.getUser);
router.patch('/update', JWTMiddleWare.identification, validatorUser.userUpdateValidation, userController.updateUser);
router.patch('/:userId/role', JWTMiddleWare.identification, validatorUser.userIdValidation, authorizationUser.canChangeRole, userController.changeRole)

module.exports = router;
