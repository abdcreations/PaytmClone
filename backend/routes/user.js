const express = require('express');

const router = express.Router(); 
const zod = require('zod');
const User = require('../db');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config');

const signupBody = zod.object({
    username : zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string()
})

router.post('/signup',async (req,res) => {
    const { success } = signupBody.safeParse(req.body);
    if(!success) return res.status(411).json({message : "Inputs are invalid"});

    const userData = await User.findOne({
        username : req.body.username
    });

    if(userData) return res.status(411).json({message : "Email already registered"});

    const user = await User.create({
        username : req.body.username,
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        password : req.body.password
    })
    const userid = user._id;
    const token = jwt.sign({
        userid
    },JWT_SECRET);

    res.json({
        message : "user created successfully",
        token : token
    })

})

router.post("/signin", async (req,res) =>{
    const {success } = signupBody.safeParse(req.body);
    if(!success) return res.status(411).json({message : "Imputs are invalid"});
    
    const userData = await User.findOne({
        username : req.body.username,
        password : req.body.password
    });

    if(!userData) res.status(411).json({message : "Error while logging in"});
    const userid = userData.user_id;
    const token = jwt.sign({
        userid
    },JWT_SECRET)
    res.json({token : token});
})

module.exports = {
    router
}