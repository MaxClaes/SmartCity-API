const JWTMiddleWare = require("../middleware/identification/IdentificationJWT");
const bandControleur = require("../controleur/bandDB");
const validatorUser = require("../middleware/user/Validator");
const validatorBand = require("../middleware/band/Validator");
const authorizationBand = require("../middleware/band/Authorization");
const authorizationUser = require("../middleware/user/Authorization");

const Router = require("express-promise-router");
const router = new Router;

const cors = require('cors')
router.use(cors())

/**
 * @swagger
 * /band/all:
 *  get:
 *      tags:
 *          - BandClient
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/BandsFound'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          403:
 *              description: The current user has not access
 *          404:
 *              description: Bands not found
 *          500:
 *              description: Internal servor error
 */
router.get('/all', JWTMiddleWare.identification, authorizationUser.mustBeManager, bandControleur.getAllBands);
/**
 * @swagger
 * /band/bandid/{bandId}:
 *  get:
 *      tags:
 *          - BandClient
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: bandId
 *            description: Band identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/BandFoundByBandId'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          403:
 *              description: The current user has not access
 *          404:
 *              description: Band/User not found
 *          500:
 *              description: Internal servor error
 */
router.get('/bandid/:bandId', JWTMiddleWare.identification, authorizationUser.mustBeManager, validatorBand.bandIdValidation, bandControleur.getBandById);
/**
 * @swagger
 * /band/bandid/{bandId}:
 *  delete:
 *      tags:
 *          - BandClient
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: bandId
 *            description: Band identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/BandDeleted'
 *          400:
 *              description: Input error(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: The current user has not access
 *          500:
 *              description: Internal servor error
 */
router.delete('/bandid/:bandId', JWTMiddleWare.identification, authorizationUser.mustBeManager, validatorBand.bandIdValidation, bandControleur.deleteBand);
/**
 * @swagger
 * /band/mybands:
 *  post:
 *      tags:
 *          - BandClient
 *      requestBody:
 *          $ref: '#/components/requestBodies/BandToInsert'
 *      responses:
 *          201:
 *              $ref: '#/components/responses/BandInserted'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          500:
 *              description: Internal servor error
 */
router.post('/mybands', JWTMiddleWare.identification, validatorBand.createBandValidation, bandControleur.createBand);
/**
 * @swagger
 * /band/mybands:
 *  get:
 *      tags:
 *          - BandClient
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/MybandsFound'
 *          401:
 *              description: The current user is not authenticated
 *          500:
 *              description: Internal servor error
 */
router.get('/mybands', JWTMiddleWare.identification, bandControleur.getMyBands);
/**
 * @swagger
 * /band/mybands/{bandId}/members:
 *  get:
 *      tags:
 *          - BandClient
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: bandId
 *            description: Band identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/MembersFoundByBandId'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          500:
 *              description: Internal servor error
 */
router.get('/mybands/:bandId/members', JWTMiddleWare.identification, validatorBand.bandIdValidation, bandControleur.getAllMembers);
/**
 * @swagger
 * /band/mybands/{bandId}/out:
 *  delete:
 *      tags:
 *          - BandClient
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: bandId
 *            description: Band identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/CurrentUserDeleted'
 *          400:
 *              description: Input error(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: The current user has not access
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal servor error
 */
router.delete('/mybands/:bandId/out', JWTMiddleWare.identification, validatorBand.bandIdValidation, authorizationBand.hasJoinedBand, bandControleur.leaveBand);
/**
 * @swagger
 * /band/mybands/{bandId}/members/{userId}:
 *  post:
 *      tags:
 *          - BandClient
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: bandId
 *            description: Band identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: userId
 *            description: User identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          201:
 *              $ref: '#/components/responses/NewMemberInserted'
 *          400:
 *              description: Input error(s)
 *          401:
 *              description: The current user is not authenticated
 *          403:
 *              description: The current user has not access
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal servor error
 */
router.post('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorUser.userIdValidation, authorizationBand.hasJoinedBand, bandControleur.addMember);
/**
 * @swagger
 * /band/mybands/{bandId}/members/{userId}:
 *  delete:
 *      tags:
 *          - BandClient
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: bandId
 *            description: Band identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: userId
 *            description: Band identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/MemberDeletedFromBand'
 *          400:
 *              description: Input error(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: The current user has not access
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal servor error
 */
router.delete('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorUser.userIdValidation, authorizationBand.isAdminAndUserSearchExists, bandControleur.deleteMember);
/**
 * @swagger
 * /band/mybands/{bandId}/members/{userId}/role:
 *  patch:
 *      tags:
 *          - BandClient
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: bandId
 *            description: Band identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: userId
 *            description: User identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/NewRoleToBandMember'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/RoleUpdatedToBandMember'
 *          400:
 *              description: Input error(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: The current user has not access
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal servor error
 */
router.patch('/mybands/:bandId/members/:userId/role', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorUser.userIdValidation, validatorBand.roleValidation, authorizationBand.isAdminAndUserSearchExists, bandControleur.changeRole);
/**
 * @swagger
 * /band/mybands/invitations:
 *  get:
 *      tags:
 *          - BandClient
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/BandInvitationsFound'
 *          401:
 *              description: The current user is not authenticated
 *          500:
 *              description: Internal servor error
 */
router.get('/invitations', JWTMiddleWare.identification, bandControleur.getAllInvitations);
/**
 * @swagger
 * /band/invitations/{bandId}/response:
 *  patch:
 *      tags:
 *          - BandClient
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: bandId
 *            description: Band identifier
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      requestBody:
 *          $ref: '#/components/requestBodies/ResponseToBandInvitation'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ResponseSentToBandInvitation'
 *          400:
 *              description: Input error(s)
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: The current user has not access
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal servor error
 */
router.patch('/invitations/:bandId/response', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorBand.statusValidation, authorizationBand.canAnswerInvitation, bandControleur.responseInvitation);

module.exports = router;
