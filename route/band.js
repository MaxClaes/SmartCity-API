const AuthoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const ValidatorMiddleWare = require("../middleware/Validator");
const BandControleur = require("../controleur/bandDB");

const Router = require("express-promise-router");
const router = new Router;

router.get('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, BandControleur.getAllBands);
router.get('/:bandId', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, BandControleur.getBandById);
router.delete('/:bandId', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, BandControleur.deleteBand);  //Manager pour supprimer n'importe quel groupe

router.post('/mybands', JWTMiddleWare.identification, BandControleur.createBand);
router.get('/mybands', JWTMiddleWare.identification, BandControleur.getBandsByUserId);
//Sortir du groupe et si le groupe n'a plus de participant alors le supprimer
router.delete('/mybands/:bandId', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserExistsInBand, ValidatorMiddleWare.authUserIsAdministratorInBand, BandControleur.deleteBand);  //Soit manager tout court, soit manager du groupe
router.post('/mybands/:bandId/member/:userId', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserExistsInBand, ValidatorMiddleWare.userExists, BandControleur.addMember);  //idBand, idNewMember | Vérifier si user dans idBand | N'importe qui du groupe peut ajouter un membre
router.delete('/mybands/:bandId/member/:userId', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserExistsInBand, ValidatorMiddleWare.userExistsInBand, ValidatorMiddleWare.authUserIsAdministratorInBand, BandControleur.deleteMember);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant
router.patch('/mybands/:bandId/member/:userId/role', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.userExistsInBand, ValidatorMiddleWare.authUserIsAdministratorInBand, ValidatorMiddleWare.roleIsValid, ValidatorMiddleWare.canChangeRoleInBand, BandControleur.changeRole);

router.get('/invitation', JWTMiddleWare.identification, BandControleur.getAllInvitations);
router.patch('/invitation/:bandId/accept', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserExistsInBand, BandControleur.acceptInvitation);
router.patch('/invitation/:bandId/refuse', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.authUserExistsInBand, BandControleur.refuseInvitation);

//router.get('/name/:label', BandControleur.getBandByName); //Si on est manager

module.exports = router;
