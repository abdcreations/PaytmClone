const express = require("express");
const { User } = require("../db");
const { default: mongoose } = require("mongoose");
const { authMiddleware } = require("../middleware");


const router = express.Router();

router.get("/balance",authMiddleware, async (req,res) => {
    const account = User.findOne({
        userId : req.userId
    });

    res.json({
        balance : account.balance
    });
})

router.post("/transfer",authMiddleware , async (req,res) => {
    const {amount , to} = req.body;

    const account = await User.findOne({
        userId : req.userId
    });

    if(account.balance < amount) return res.status(400).json({message : "Insufficient Balance"});

    const toAccount = await User.findOne({
        userId : to
    })

    if(!toAccount) return res.status(400).json({message : "Invalid account"});

    await User.updateOne({userId : req.userId}, {$inc : {balance : -amount}});
    await User.updateOne({userId : to}, {$inc : {balance : amount}});

    res.json({message : "Transfer Successful"});
})

module.exports = router;