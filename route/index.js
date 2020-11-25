const UserRouter = require('./user');
const DrinkRouter = require('./drink');
const BandRouter = require('./band');
const router = require("express").Router();

router.use("/user", UserRouter);
router.use("/drink", DrinkRouter);
router.use("/band", BandRouter);

module.exports = router;
