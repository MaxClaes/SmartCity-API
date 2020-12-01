const authoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const bandControleur = require("../controleur/bandDB");
const validatorUser = require("../middleware/user/Validator");
const validatorBand = require("../middleware/band/ValidatorBand");

const Router = require("express-promise-router");
const router = new Router;

router.get('/all', JWTMiddleWare.identification, authoMiddleware.mustBeManager, bandControleur.getAllBands);
router.get('/bandid/:bandId', JWTMiddleWare.identification, authoMiddleware.mustBeManager, validatorBand.bandIdValidation, bandControleur.getBandById);
router.delete('/bandid/:bandId', JWTMiddleWare.identification, authoMiddleware.mustBeManager, validatorBand.bandIdValidation, bandControleur.deleteBand);

// router.post('/mybands', JWTMiddleWare.identification, validatorBand.createBandValidation, bandControleur.createBand);   //Faire les vérifications des entrées
// router.get('/mybands', JWTMiddleWare.identification, bandControleur.getBandsByUserId);
// router.get('/mybands/:bandId/members', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorBand.authUserExistsInBand, validatorBand.hasAcceptedStatus, bandControleur.getBandById);
// router.delete('/mybands/:bandId/out', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorBand.authUserExistsInBand, validatorBand.hasAcceptedStatus, bandControleur.leaveBand);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant |Si plus de membre => band supprimé
// router.post('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorUser.userValidation, validatorBand.authUserExistsInBand, validatorBand.hasAcceptedStatus, validatorBand.userIsNotInBand, bandControleur.addMember);  //idBand, idNewMember | Vérifier si user dans idBand | N'importe qui du groupe peut ajouter un membre
// router.delete('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorUser.userValidation, validatorBand.authUserExistsInBand, validatorBand.userExistsInBand, validatorBand.authUserIsAdministratorInBand, bandControleur.deleteMember);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant
// router.patch('/mybands/:bandId/members/:userId/role', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorUser.userValidation, validatorBand.authUserIsAdministratorInBand, validatorBand.userExistsInBand, validatorBand.roleIsValid, bandControleur.changeRole);

router.post('/mybands', JWTMiddleWare.identification, validatorBand.createBandValidation, bandControleur.createBand);   //Faire les vérifications des entrées
router.get('/mybands', JWTMiddleWare.identification, bandControleur.getBandsByUserId);
router.get('/mybands/:bandId/members', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorBand.canHaveInformations, bandControleur.getBandById);
router.delete('/mybands/:bandId/out', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorBand.canLeaveBand, bandControleur.leaveBand);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant |Si plus de membre => band supprimé
router.post('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorUser.userIdValidation, validatorBand.canAddNewMember, bandControleur.addMember);  //idBand, idNewMember | Vérifier si user dans idBand | N'importe qui du groupe peut ajouter un membre
router.delete('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorUser.userIdValidation, validatorBand.canDeleteMember, bandControleur.deleteMember);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant
router.patch('/mybands/:bandId/members/:userId/role', JWTMiddleWare.identification, validatorBand.bandIdValidation, validatorUser.userIdValidation, validatorBand.canChangeRole, bandControleur.changeRole);


router.get('/invitations', JWTMiddleWare.identification, bandControleur.getAllInvitations);
router.patch('/invitations/:bandId/response', JWTMiddleWare.identification, validatorBand.bandExists, validatorBand.authUserExistsInBand, validatorBand.currentStatusIsWaiting, validatorBand.statusIsValid, bandControleur.responseInvitation);

//router.get('/mybands/:bandId', JWTMiddleWare.identification, validatorBand.bandExists, validatorBand.authUserExistsInBand, bandControleur.getBandById);
//Sortir du groupe et si le groupe n'a plus de participant alors le supprimer
//router.delete('/mybands/:bandId', JWTMiddleWare.identification, validatorBand.bandExists, validatorBand.authUserExistsInBand, validatorBand.authUserIsAdministratorInBand, bandControleur.deleteBand);  //Soit manager tout court, soit manager du groupe
//router.get('/name/:label', bandControleur.getBandByName); //Si on est manager

module.exports = router;
