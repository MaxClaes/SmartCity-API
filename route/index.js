const UserRouter = require('./user');
const DrinkRouter = require('./drink');
const ReportRouter = require('./report');
const BandRouter = require('./band');
const router = require("express").Router();

router.use("/user", UserRouter);
router.use("/drink", DrinkRouter);
router.use("/report", ReportRouter);
router.use("/band", BandRouter);

module.exports = router;
