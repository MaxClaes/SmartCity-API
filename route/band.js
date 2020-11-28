const AuthoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const ValidatorBandMiddleWare = require("../middleware/ValidatorBand");
const BandControleur = require("../controleur/bandDB");

const Router = require("express-promise-router");
const router = new Router;

router.get('/all', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, BandControleur.getAllBands);
router.get('/bandid/:bandId', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, ValidatorBandMiddleWare.bandExists, BandControleur.getBandById);
router.delete('/bandid/:bandId', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, ValidatorBandMiddleWare.bandExists, BandControleur.deleteBand);  //Manager pour supprimer n'importe quel groupe

router.post('/mybands', JWTMiddleWare.identification, BandControleur.createBand);   //Faire les vérifications des entrées
router.get('/mybands', JWTMiddleWare.identification, BandControleur.getBandsByUserId);
router.get('/mybands/:bandId/members', JWTMiddleWare.identification, ValidatorBandMiddleWare.bandExists, ValidatorBandMiddleWare.authUserExistsInBand, ValidatorBandMiddleWare.hasAcceptedStatus, BandControleur.getBandById);
router.delete('/mybands/:bandId/out', JWTMiddleWare.identification, ValidatorBandMiddleWare.bandExists, ValidatorBandMiddleWare.authUserExistsInBand, ValidatorBandMiddleWare.hasAcceptedStatus, BandControleur.deleteMember);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant |Si plus de membre => band supprimé
router.post('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, ValidatorBandMiddleWare.bandExists, ValidatorBandMiddleWare.authUserExistsInBand, ValidatorBandMiddleWare.hasAcceptedStatus, ValidatorBandMiddleWare.userExists, ValidatorBandMiddleWare.userIsNotInBand, BandControleur.addMember);  //idBand, idNewMember | Vérifier si user dans idBand | N'importe qui du groupe peut ajouter un membre
router.delete('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, ValidatorBandMiddleWare.bandExists, ValidatorBandMiddleWare.authUserExistsInBand, ValidatorBandMiddleWare.userExistsInBand, ValidatorBandMiddleWare.authUserIsAdministratorInBand, BandControleur.deleteMember);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant
router.patch('/mybands/:bandId/members/:userId/role', JWTMiddleWare.identification, ValidatorBandMiddleWare.bandExists, ValidatorBandMiddleWare.authUserIsAdministratorInBand, ValidatorBandMiddleWare.userExistsInBand, ValidatorBandMiddleWare.roleIsValid, BandControleur.changeRole);

router.get('/invitations', JWTMiddleWare.identification, BandControleur.getAllInvitations);
router.patch('/invitations/:bandId/response', JWTMiddleWare.identification, ValidatorBandMiddleWare.bandExists, ValidatorBandMiddleWare.authUserExistsInBand, ValidatorBandMiddleWare.currentStatusIsWaiting, ValidatorBandMiddleWare.statusIsValid, BandControleur.responseInvitation);

//router.get('/mybands/:bandId', JWTMiddleWare.identification, ValidatorBandMiddleWare.bandExists, ValidatorBandMiddleWare.authUserExistsInBand, BandControleur.getBandById);
//Sortir du groupe et si le groupe n'a plus de participant alors le supprimer
//router.delete('/mybands/:bandId', JWTMiddleWare.identification, ValidatorBandMiddleWare.bandExists, ValidatorBandMiddleWare.authUserExistsInBand, ValidatorBandMiddleWare.authUserIsAdministratorInBand, BandControleur.deleteBand);  //Soit manager tout court, soit manager du groupe
//router.get('/name/:label', BandControleur.getBandByName); //Si on est manager

module.exports = router;
