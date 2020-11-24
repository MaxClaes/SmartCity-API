const AchatRouter = require('./achat');
const UserRouter = require('./user');
const DrinkRouter = require('./drink');
const ReportRouter = require('./report');
const router = require("express").Router();

//router.use("/achat", AchatRouter);
router.use("/user", UserRouter);
router.use("/drink", DrinkRouter);
router.use("/report", ReportRouter);

module.exports = router;
