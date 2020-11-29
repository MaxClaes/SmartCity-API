const authoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const validatorBandMiddleWare = require("../middleware/ValidatorBand");
const bandControleur = require("../controleur/bandDB");

const Router = require("express-promise-router");
const router = new Router;

router.get('/all', JWTMiddleWare.identification, authoMiddleware.mustBeManager, bandControleur.getAllBands);
router.get('/bandid/:bandId', JWTMiddleWare.identification, authoMiddleware.mustBeManager, validatorBandMiddleWare.bandExists, bandControleur.getBandById);
router.delete('/bandid/:bandId', JWTMiddleWare.identification, authoMiddleware.mustBeManager, validatorBandMiddleWare.bandExists, bandControleur.deleteBand);  //Manager pour supprimer n'importe quel groupe

router.post('/mybands', JWTMiddleWare.identification, bandControleur.createBand);   //Faire les vérifications des entrées
router.get('/mybands', JWTMiddleWare.identification, bandControleur.getBandsByUserId);
router.get('/mybands/:bandId/members', JWTMiddleWare.identification, validatorBandMiddleWare.bandExists, validatorBandMiddleWare.authUserExistsInBand, validatorBandMiddleWare.hasAcceptedStatus, bandControleur.getBandById);
router.delete('/mybands/:bandId/out', JWTMiddleWare.identification, validatorBandMiddleWare.bandExists, validatorBandMiddleWare.authUserExistsInBand, validatorBandMiddleWare.hasAcceptedStatus, bandControleur.deleteMember);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant |Si plus de membre => band supprimé
router.post('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, validatorBandMiddleWare.bandExists, validatorBandMiddleWare.authUserExistsInBand, validatorBandMiddleWare.hasAcceptedStatus, validatorBandMiddleWare.userExists, validatorBandMiddleWare.userIsNotInBand, bandControleur.addMember);  //idBand, idNewMember | Vérifier si user dans idBand | N'importe qui du groupe peut ajouter un membre
router.delete('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, validatorBandMiddleWare.bandExists, validatorBandMiddleWare.authUserExistsInBand, validatorBandMiddleWare.userExistsInBand, validatorBandMiddleWare.authUserIsAdministratorInBand, bandControleur.deleteMember);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant
router.patch('/mybands/:bandId/members/:userId/role', JWTMiddleWare.identification, validatorBandMiddleWare.bandExists, validatorBandMiddleWare.authUserIsAdministratorInBand, validatorBandMiddleWare.userExistsInBand, validatorBandMiddleWare.roleIsValid, bandControleur.changeRole);

router.get('/invitations', JWTMiddleWare.identification, bandControleur.getAllInvitations);
router.patch('/invitations/:bandId/response', JWTMiddleWare.identification, validatorBandMiddleWare.bandExists, validatorBandMiddleWare.authUserExistsInBand, validatorBandMiddleWare.currentStatusIsWaiting, validatorBandMiddleWare.statusIsValid, bandControleur.responseInvitation);

//router.get('/mybands/:bandId', JWTMiddleWare.identification, validatorBandMiddleWare.bandExists, validatorBandMiddleWare.authUserExistsInBand, bandControleur.getBandById);
//Sortir du groupe et si le groupe n'a plus de participant alors le supprimer
//router.delete('/mybands/:bandId', JWTMiddleWare.identification, validatorBandMiddleWare.bandExists, validatorBandMiddleWare.authUserExistsInBand, validatorBandMiddleWare.authUserIsAdministratorInBand, bandControleur.deleteBand);  //Soit manager tout court, soit manager du groupe
//router.get('/name/:label', bandControleur.getBandByName); //Si on est manager

module.exports = router;
