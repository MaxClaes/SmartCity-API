const authoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const userController = require('../controleur/userDB');
const validatorUser = require('../middleware/ValidatorUser');

const { body , check} = require('express-validator');

const Router = require("express-promise-router");
const router = new Router;

router.post('/login', validatorUser.loginValidation, userController.login);
router.post('/registration', validatorUser.userRegistrationValidation, userController.createUser);
router.get('/', JWTMiddleWare.identification, authoMiddleware.mustBeManager, userController.getAllUsers);
router.get('/:id', JWTMiddleWare.identification, validatorUser.idValidation, authoMiddleware.mustBeManagerOrCreator, userController.getUser);
router.patch('/update', JWTMiddleWare.identification, validatorUser.userUpdateValidation, userController.updateUser);
router.patch('/role', JWTMiddleWare.identification, validatorUser.changeRoleValidation, authoMiddleware.canChangeRole, userController.changeRole)

module.exports = router;
