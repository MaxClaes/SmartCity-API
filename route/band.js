const AuthoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const ValidatorMiddleWare = require("../middleware/Validator");
const BandControleur = require("../controleur/bandDB");

const Router = require("express-promise-router");
const router = new Router;

router.get('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, BandControleur.getAllBands);
router.get('/:idBand', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, BandControleur.getBandById);
router.get('/mybands', JWTMiddleWare.identification, BandControleur.getBandsByUserId);
router.post('/', JWTMiddleWare.identification, BandControleur.createBand);
router.delete('/:idBand', JWTMiddleWare.identification, AuthoMiddleware.canDeleteBand, BandControleur.deleteBand);  //Soit manager tout court, soit manager du groupe

router.patch('/:bandId/member/:userId', JWTMiddleWare.identification, ValidatorMiddleWare.bandExists, ValidatorMiddleWare.userExists, BandControleur.addMember);  //idBand, idNewMember | Vérifier si user dans idBand | N'importe qui du groupe peut ajouter un membre
router.delete('/:bandId/member/:userId', JWTMiddleWare.identification, BandControleur.deleteMember);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant
router.patch('/:bandId/member/:userId/role', JWTMiddleWare.identification, BandControleur.changeRole);

router.get('/invitation', JWTMiddleWare.identification, BandControleur.getAllInvitations);
router.patch('/invitation/:id/accept', JWTMiddleWare.identification, BandControleur.acceptInvitation);
router.patch('/invitation/:id/refuse', JWTMiddleWare.identification, BandControleur.refuseInvitation);

//router.get('/name/:label', BandControleur.getBandByName); //Si on est manager

module.exports = router;
