const JWTMiddleWare = require("../middleware/identification/IdentificationJWT");
const consumptionController = require("../controleur/consumptionDB");
const validatorConsumption = require("../middleware/consumption/Validator");
const validatorUser = require("../middleware/user/Validator");
const authorizationConsumption = require("../middleware/consumption/Authorization");

const Router = require("express-promise-router");
const router = new Router;

const cors = require('cors')
router.use(cors())

/**
 * @swagger
 * /consumption:
 *  post:
 *      tags:
 *          - Consumption
 *      requestBody:
 *          $ref: '#/components/requestBodies/ConsumptionToInsert'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/ConsumptionInserted'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          500:
 *              description: Internal servor error
 */
router.post('/', JWTMiddleWare.identification, validatorConsumption.createConsumptionValidation, consumptionController.createConsumption);
/**
 * @swagger
 * /consumption:
 *  patch:
 *      tags:
 *          - Consumption
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/ConsumptionToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ConsumptionUpdated'
 *          400:
 *              description: Input error(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Internal servor error
 */
router.patch('/', JWTMiddleWare.identification, validatorConsumption.updateConsumptionValidation, consumptionController.updateConsumption);
/**
 * @swagger
 * /consumption:
 *  get:
 *      tags:
 *         - Consumption
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ConsumptionsFound'
 *          401:
 *              description: The current user is not authenticated
 *          500:
 *              description: Internal servor error
 */
router.get('/', JWTMiddleWare.identification, consumptionController.getAllConsumptionsByUserId);
/**
 * @swagger
 * /consumption/{id}:
 *  delete:
 *      tags:
 *          - Consumption
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: id
 *            description: Consumption identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ConsumptionDeleted'
 *          400:
 *              description: Input error(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          404:
 *              description: Consumption not found
 *          500:
 *              description: Internal servor error
 */
router.delete('/:id', JWTMiddleWare.identification, validatorConsumption.deleteConsumptionValidation, consumptionController.deleteConsumption);
/**
 * @swagger
 * /consumption/alcohollevel/{userId}:
 *  get:
 *      tags:
 *         - Consumption
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
 *              $ref: '#/components/responses/AlcoholLevelFoundByUserId'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          404:
 *              description: Consumption not found
 *          500:
 *              description: Internal servor error
 */
router.get('/alcohollevel/:userId', JWTMiddleWare.identification, validatorUser.userIdValidation, authorizationConsumption.canGetAlcoholLevel, consumptionController.getAlcoholLevel);
//router.get('/date', JWTMiddleWare.identification, consumptionController.getAllConsumptionsByDate);

module.exports = router;
