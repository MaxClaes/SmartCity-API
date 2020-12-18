const JWTMiddleWare = require("../middleware/identification/IdentificationJWT");
const userController = require("../controleur/userDB");
const validatorUser = require("../middleware/user/Validator");
const authorizationUser = require("../middleware/user/Authorization");

const Router = require("express-promise-router");
const router = new Router;

const cors = require('cors')
router.use(cors())

/**
 * @swagger
 * /user/login:
 *  post:
 *      tags:
 *          - User
 *      description: Send a token for authentication
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToLog'
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UserLogged'
 *          400:
 *              description: Input error(s)
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal servor error
 */
router.post('/login', validatorUser.loginValidation, userController.login);
/**
 * @swagger
 * /user/registration:
 *  post:
 *      tags:
 *          - User
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToInsert'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/UserInsert'
 *          400:
 *              description: Input error(s)
 *          409:
 *              description: Conflic email already exists
 *          500:
 *              description: Internal servor error
 */
router.post('/registration', validatorUser.userRegistrationValidation, userController.createUser);
/**
 * @swagger
 * /user:
 *  get:
 *      tags:
 *         - User
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UsersFound'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          403:
 *              $ref: '#/components/responses/MustBeManager'
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal servor error
 */
router.get('/', JWTMiddleWare.identification, authorizationUser.mustBeManager, userController.getAllUsers);
/**
 * @swagger
 * /user/name/{name}:
 *  get:
 *      tags:
 *          - User
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: name
 *            description: Name of user
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UsersFoundByName'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal servor error
 */
router.get('/name/:name', JWTMiddleWare.identification, validatorUser.nameValidation, userController.getAllUsersByName);
/**
 * @swagger
 * /user/{userId}:
 *  get:
 *      tags:
 *          - User
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: userId
 *            description: User identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/UserFound'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          403:
 *              $ref: '#/components/responses/MustBeManagerOrCreator'
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal servor error
 */
router.get('/:userId', JWTMiddleWare.identification, validatorUser.userIdValidation, authorizationUser.mustBeManagerOrCreator, userController.getUser);
/**
 * @swagger
 * /user/update/{userId}:
 *  patch:
 *      tags:
 *          - User
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: userId
 *            description: User identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/UserUpdated'
 *          400:
 *              description: Input error(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Internal servor error
 */
router.patch('/update/:userId', JWTMiddleWare.identification, validatorUser.userUpdateValidation, validatorUser.addressUpdateValidation, authorizationUser.mustBeManagerOrCreator, userController.updateUser);
/**
 * @swagger
 * /user/role/{userId}:
 *  patch:
 *      tags:
 *          - User
 *      requestBody:
 *          $ref: '#/components/requestBodies/RoleToChangeTo'
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: userId
 *            description: User identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/RoleChanged'
 *          400:
 *              $ref: '#/components/responses/InputErrors'
 *          401:
 *              $ref: '#/components/responses/Unauthenticated'
 *          403:
 *              $ref: '#/components/responses/MustBeAdmin'
 *          404:
 *              $ref: '#/components/responses/UserNotFound'
 *          500:
 *              description: Internal servor error
 */
router.patch('/role/:userId', JWTMiddleWare.identification, validatorUser.userIdValidation, validatorUser.roleValidation, authorizationUser.canChangeRole, userController.changeRole)

module.exports = router;
