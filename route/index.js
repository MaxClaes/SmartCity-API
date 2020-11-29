const userRouter = require('./user');
const drinkRouter = require('./drink');
const bandRouter = require('./band');
const consumptionRouter = require('./consumption');
const router = require("express").Router();

router.use("/user", userRouter);
router.use("/drink", drinkRouter);
router.use("/band", bandRouter);
router.use("/consumption", consumptionRouter);

module.exports = router;
