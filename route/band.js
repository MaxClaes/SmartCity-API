const AuthoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const ValidatorMiddleWare = require("../middleware/Validator");
const BandControleur = require("../controleur/bandDB");

const Router = require("express-promise-router");
const router = new Router;

router.get('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, BandControleur.getAllBands);
router.get('/:bandId', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, BandControleur.getBandById);
router.post('/', JWTMiddleWare.identification, BandControleur.createBand);
router.delete('/:bandId', JWTMiddleWare.identification, AuthoMiddleware.canDeleteBand, BandControleur.deleteBand);  //Soit manager tout court, soit manager du groupe

router.get('/mybands', JWTMiddleWare.identification, BandControleur.getBandsByUserId);
router.delete('/mybands/:bandId', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.userInBand, ValidatorMiddleWare.isManagerInBand, BandControleur.deleteBand);  //Soit manager tout court, soit manager du groupe
router.post('/mybands/:bandId/member/:userId', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.userExists, BandControleur.addMember);  //idBand, idNewMember | Vérifier si user dans idBand | N'importe qui du groupe peut ajouter un membre
router.delete('/mybands/:bandId/member/:userId', JWTMiddleWare.identification, BandControleur.deleteMember);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant
router.patch('/mybands/:bandId/member/:userId/role', JWTMiddleWare.identification, BandControleur.changeRole);

router.get('/invitation', JWTMiddleWare.identification, BandControleur.getAllInvitations);
router.patch('/invitation/:id/accept', JWTMiddleWare.identification, BandControleur.acceptInvitation);
router.patch('/invitation/:id/refuse', JWTMiddleWare.identification, BandControleur.refuseInvitation);

//router.get('/name/:label', BandControleur.getBandByName); //Si on est manager

module.exports = router;
