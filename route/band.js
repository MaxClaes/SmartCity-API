const AuthoMiddleware = require("../middleware/Authorization");
const JWTMiddleWare = require("../middleware/IdentificationJWT");
const BandControleur = require("../controleur/bandDB");

const Router = require("express-promise-router");
const router = new Router;

router.get('/', JWTMiddleWare.identification, AuthoMiddleware.mustBeManager, BandControleur.getAllBands);
router.get('/:id', JWTMiddleWare.identification, AuthoMiddleware.canSeeBandById, BandControleur.getBandById);  //Soit manager soit participant du groupe
router.post('/', JWTMiddleWare.identification, BandControleur.createBand);
router.delete('/:id', JWTMiddleWare.identification, AuthoMiddleware.canDeleteBand, BandControleur.deleteBand);  //Soit manager tout court, soit manager du groupe

router.patch('/:id/addMembrer', JWTMiddleWare.identification, BandControleur.addMember);  //idBand, idNewMember | Vérifier si user dans idBand | N'importe qui du groupe peut ajouter un membre
router.patch('/:id/deleteMember', JWTMiddleWare.identification, BandControleur.deleteMember);  //idBand, idMember | Vérifier si user dans idBand, idMember dans idBand, user a role suffisant
router.patch('/:id/role', JWTMiddleWare.identification, BandControleur.changeRole);

router.get('/invitation', JWTMiddleWare.identification, BandControleur.getAllInvitations);
router.patch('/invitation/:id/accept', JWTMiddleWare.identification, BandControleur.acceptInvitation);
router.patch('/invitation/:id/refuse', JWTMiddleWare.identification, BandControleur.refuseInvitation);

//router.get('/name/:label', BandControleur.getBandByName); //Si on est manager

module.exports = router;
