const AuthoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const ValidatorMiddleWare = require("../middleware/Validator");
const BandControleur = require("../controleur/bandDB");

const Router = require("express-promise-router");
const router = new Router;

router.get('/all', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, BandControleur.getAllBands);
router.get('/bandid/:bandId', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, BandControleur.getBandById);
router.delete('/bandid/:bandId', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, BandControleur.deleteBand);  //Manager pour supprimer n'importe quel groupe

router.post('/mybands', JWTMiddleWare.identification, BandControleur.createBand);   //Faire les vérifications des entrées
router.get('/mybands', JWTMiddleWare.identification, BandControleur.getBandsByUserId);
router.get('/mybands/:bandId/members', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserExistsInBand, ValidatorMiddleWare.hasAcceptedStatus, BandControleur.getBandById);
router.delete('/mybands/:bandId/out', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserExistsInBand, ValidatorMiddleWare.hasAcceptedStatus, BandControleur.deleteMember);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant |Si plus de membre => band supprimé
router.post('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserExistsInBand, ValidatorMiddleWare.hasAcceptedStatus, ValidatorMiddleWare.userExists, ValidatorMiddleWare.userIsNotInBand, BandControleur.addMember);  //idBand, idNewMember | Vérifier si user dans idBand | N'importe qui du groupe peut ajouter un membre
router.delete('/mybands/:bandId/members/:userId', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserExistsInBand, ValidatorMiddleWare.userExistsInBand, ValidatorMiddleWare.authUserIsAdministratorInBand, BandControleur.deleteMember);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant
router.patch('/mybands/:bandId/members/:userId/role', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserIsAdministratorInBand, ValidatorMiddleWare.userExistsInBand, ValidatorMiddleWare.roleIsValid, BandControleur.changeRole);

router.get('/invitations', JWTMiddleWare.identification, BandControleur.getAllInvitations);
router.patch('/invitations/:bandId/response', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserExistsInBand, ValidatorMiddleWare.currentStatusIsWaiting, ValidatorMiddleWare.statusIsValid, BandControleur.responseInvitation);

//router.get('/mybands/:bandId', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserExistsInBand, BandControleur.getBandById);
//Sortir du groupe et si le groupe n'a plus de participant alors le supprimer
//router.delete('/mybands/:bandId', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserExistsInBand, ValidatorMiddleWare.authUserIsAdministratorInBand, BandControleur.deleteBand);  //Soit manager tout court, soit manager du groupe
//router.get('/name/:label', BandControleur.getBandByName); //Si on est manager

module.exports = router;
