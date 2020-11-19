const ProduitRouter = require('./produit');
const AchatRouter = require('./achat');
const ClientRouter = require('./client');
const UserRouter = require('./user');
const BoissonRouter = require('./boisson');
const router = require("express").Router();

router.use("/produit", ProduitRouter);
router.use("/achat", AchatRouter);
router.use("/client", ClientRouter);
router.use("/user", UserRouter);
router.use("/boisson", BoissonRouter);

module.exports = router;
