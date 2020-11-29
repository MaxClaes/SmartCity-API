const userRouter = require('./user');
const drinkRouter = require('./drink');
const bandRouter = require('./band');
const router = require("express").Router();

router.use("/user", userRouter);
router.use("/drink", drinkRouter);
router.use("/band", bandRouter);

module.exports = router;
