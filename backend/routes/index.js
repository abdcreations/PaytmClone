const express = require('express');
const userRouter = require('./user');

const router = express.Router();

const app = express();

router.get("/user",userRouter);

module.exports = {
    router
}