const JWTMiddleWare = require("../middleware/identification/IdentificationJWT");
const drinkControleur = require("../controleur/drinkDB");
const validatorDrink = require("../middleware/drink/Validator");
const validatorUser = require("../middleware/user/Validator");
const authorizationDrink = require("../middleware/drink/Authorization");
const authorizationUser = require("../middleware/user/Authorization");

const Router = require("express-promise-router");
const router = new Router;

const cors = require('cors')
router.use(cors())

/**
 * @swagger
 * /drink:
 *  get:
 *      tags:
 *         - Drink
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/DrinksFound'
 *          401:
 *              description: The current user is not authenticated
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal servor error
 */
router.get('/', JWTMiddleWare.identification, drinkControleur.getAllDrinks);
/**
 * @swagger
 * /drink/name/{label}:
 *  get:
 *      tags:
 *         - User
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: label
 *            description: User identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/DrinksFoundByLabel'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          404:
 *              description: Drink not found
 *          500:
 *              description: Internal servor error
 */
router.get('/name/:label', JWTMiddleWare.identification, validatorDrink.labelValidation,drinkControleur.getDrinksByName);
/**
 * @swagger
 * /drink/name/{userId}:
 *  get:
 *      tags:
 *         - User
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
 *          200:
 *              $ref: '#/components/responses/DrinkFoundByUserId'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          403:
 *              description: The current user has not access
 *          404:
 *              description: Drink not found
 *          500:
 *              description: Internal servor error
 */
router.get('/user/:userId', JWTMiddleWare.identification, validatorUser.userIdValidation, authorizationUser.mustBeManagerOrCreator, drinkControleur.getDrinksByCreatedBy);
/**
 * @swagger
 * /drink/:
 *  post:
 *      tags:
 *          - Drink
 *      requestBody:
 *          $ref: '#/components/requestBodies/DrinkToInsert'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/DrinkInserted'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          500:
 *              description: Internal servor error
 */
router.post('/', JWTMiddleWare.identification, validatorDrink.createModifyDrinkValidation, drinkControleur.createDrink);
/**
 * @swagger
 * /drink/{drinkId}:
 *  patch:
 *      tags:
 *          - Drink
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: drinkId
 *            description: Drink identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/DrinkToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/DrinkUpdated'
 *          400:
 *              description: Input error(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: The current user has not access
 *          404:
 *              description: Drink not found
 *          500:
 *              description: Internal servor error
 */
router.patch('/:drinkId', JWTMiddleWare.identification, validatorDrink.drinkIdValidation, validatorDrink.createModifyDrinkValidation, authorizationDrink.canModifyOrDeleteDrink, drinkControleur.updateDrink);
/**
 * @swagger
 * /drink/{drinkId}:
 *  delete:
 *      tags:
 *          - Drink
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: drinkId
 *            description: Drink identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/DrinkDeleted'
 *          400:
 *              description: Input error(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: The current user has not access
 *          404:
 *              description: Drink not found
 *          500:
 *              description: Internal servor error
 */
router.delete('/:drinkId', JWTMiddleWare.identification, validatorDrink.drinkIdValidation, authorizationDrink.canModifyOrDeleteDrink, drinkControleur.deleteDrink);
/**
 * @swagger
 * /{drinkId}/report/reset:
 *  patch:
 *      tags:
 *          - Drink
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: drinkId
 *            description: Drink identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/DrinkReportReseted'
 *          400:
 *              description: Input error(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: The current user has not access
 *          404:
 *              description: Drink not found
 *          500:
 *              description: Internal servor error
 */
router.patch('/:drinkId/report/reset', JWTMiddleWare.identification, validatorDrink.drinkIdValidation, authorizationUser.mustBeManager, drinkControleur.resetReport);
/**
 * @swagger
 * /{drinkId}/report/increment/{number}:
 *  patch:
 *      tags:
 *          - Drink
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: drinkId
 *            description: Drink identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: number
 *            description: Number of increment
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/DrinkReportIncremented'
 *          400:
 *              description: Input error(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Drink not found
 *          500:
 *              description: Internal servor error
 */
router.patch('/:drinkId/report/increment/:number', JWTMiddleWare.identification, validatorDrink.drinkIdValidation, validatorDrink.drinkNumberReportValidation, drinkControleur.manageReport);

module.exports = router;
