const ProduitRouter = require('./produit');
const AchatRouter = require('./achat');
const ClientRouter = require('./client');
const UserRouter = require('./user');
const DrinkRouter = require('./drink');
const router = require("express").Router();

router.use("/produit", ProduitRouter);
router.use("/achat", AchatRouter);
router.use("/client", ClientRouter);
router.use("/user", UserRouter);
router.use("/drink", DrinkRouter);

module.exports = router;
