const express = require('express');

const router = express.Router(); 
const zod = require('zod');
const {User, Account} = require('../db');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware');

const signupBody = zod.object({
    username : zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string()
})

const updateBody = zod.object({
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string()
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
    const userId = user._id;

    //giving random balance to user after signing up
    await Account.create({
        userId,
        balance : 1 + Math.random() * 10000
    })

    
    const token = jwt.sign({
        userId
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

router.put("/",authMiddleware,async (req,res) => {
    const {success} = updateBody.safeParse(req.body);
    if(!success) return res.status(411).json({message : "Error while updating the credentials"});
    
    await User.updateOne({id : req.userId}, req.body);

    res.json({message : "updated successfully"});
})


router.get("/",authMiddleware,async (req,res) => {
    const filter = req.query.filter;
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user : users.map((user) => ({
            username  : user.username,
            firstName :  user.firstName,
            lastName  : user.lastName,
            _id  : user._id
        }))
    })
})

module.exports = router;