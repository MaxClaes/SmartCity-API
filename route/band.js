const authoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const bandControleur = require("../controleur/bandDB");
const validatorUser = require("../middleware/user/Validator");
const validatorBand = require("../middleware/band/ValidatorBand");
const authorizationBand = require("../middleware/band/Authorization");

const Router = require("express-promise-router");
const router = new Router;

router.get('/all', JWTMiddleWare.identification, authoMiddleware.mustBeManager, bandControleur.getAllBands);
router.get('/bandid/:bandId', JWTMiddleWare.identification, authoMiddleware.mustBeManager, validatorBand.bandIdValidation, bandControleur.getBandById);
router.delete('/bandid/:bandId', JWTMiddleWare.identification, authoMiddleware.mustBeManager, validatorBand.bandIdValidation, bandControleur.deleteBand);

router.post('/mybands', JWTMiddleWare.identification, validatorBand.createBandValidation, bandControleur.createBand);
router.get('/mybands', JWTMiddleWare.identification, bandControleur.getMyBands);
router.get('/mybands/:bandId/members', JWTMiddleWare.identification, validatorBand.bandIdValidation, authorizationBand.hasJoinedBand, bandControleur.getBandById);
router.delete('/mybands/:bandId/out', JWTMiddleWare.identification, validatorBand.bandIdValidation, authorizationBand.hasJoinedBand, bandControleur.leaveBand);
router.post('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorUser.userIdValidation, authorizationBand.hasJoinedBand, bandControleur.addMember);
router.delete('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorUser.userIdValidation, authorizationBand.isAdminAndUserSearchExists, bandControleur.deleteMember);
router.patch('/mybands/:bandId/members/:userId/role', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorUser.userIdValidation, validatorBand.roleValidation, authorizationBand.isAdminAndUserSearchExists, bandControleur.changeRole);

router.get('/invitations', JWTMiddleWare.identification, bandControleur.getAllInvitations);
router.patch('/invitations/:bandId/response', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorBand.statusValidation, authorizationBand.canAnswerInvitation, bandControleur.responseInvitation);

//router.get('/name/:label', bandControleur.getBandByName); //Si on est manager

module.exports = router;
