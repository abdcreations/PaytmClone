const express = require('express');
const userRouter = require('./user');
const  accountRoute  = require('./accounts');

const router = express.Router();
router.use("/user", userRouter);
router.use("/account", accountRoute);


module.exports = router;

