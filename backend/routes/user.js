const express= require('express')
const zod= require('zod')
const jwt= require('jsonwebtoken')
const { User, Account }= require('../db')
const { JWT_SECRET }= require('../config')
const { authMiddleware }= require('../middleware')

const userRouter= express.Router()

const userSignupSchema= zod.object({
    username: zod.string().email(),
    firstName: zod.string().max(20),
    lastName: zod.string().max(20),
    password: zod.string().min(6).max(15)
})

const userSigninSchema= zod.object({
    username: zod.string().email(),
    password: zod.string().min(6).max(15)
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

userRouter.post('/signup', async (req, res) => {
    const { success }= userSignupSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs!"
        })
    }

    const existingUser= await User.findOne({username: req.body.username})
    if(existingUser) 
        return res.status(411).json({message: "Email already register!"})
    
    const newUser= await User.create(req.body)
    
    const userId= newUser._id
    const token= jwt.sign({userId}, JWT_SECRET)

    await Account.create({
        userId: userId,
        balance: 1 + Math.random() * 10000
    })

    res.status(200).json({
        message: "User created successfully",
        token: token
    })
})

userRouter.post("/signin", async (req, res) => {
    const { success }= userSigninSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs!"
        })
    }

    const existingUser= await User.findOne({username: req.body.username, password: req.body.password})
    if(!existingUser) 
        return res.status(411).json({message: "User not exist / Mismatch password!"})
    
    const userId= existingUser._id
    const token= jwt.sign({userId}, JWT_SECRET)

    res.status(200).json({
        token: token
    })
})

userRouter.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success)
        res.status(411).json({message: "Error while updating information!"})

    const existingUser= await User.findOne({_id: req.userId})
    if(!existingUser)
        return res.status(411).json({message: "User not exist!"})
    
    try {
        const userId= existingUser._id
        await User.updateOne({_id: userId}, req.body)
        res.status(200).json({message: "Updated successfully"})
    } catch(error){
        return res.status(411).json({message: "Error while updating information!"})
    }
})

userRouter.get("/bulk", authMiddleware, async (req, res) => {
    const filterString= req.query.filter

    if(filterString === undefined)
        return res.status(411).json({message: "Query not provided!"})
    
        const filterParts = filterString.split(' ');

        const filterConditions = filterParts.map(part => ({
            $or: [
                { firstName: { "$regex": part, "$options": "i" } },
                { lastName: { "$regex": part, "$options": "i" } }
            ]
        }));
    
        const filteredData = await User.find({ $and: filterConditions });
    
    if(filteredData.length == 0)
        return res.status(411).json({message: "User not exist!"})

    res.status(200).json({users: filteredData})
})

userRouter.get("/userinfo", authMiddleware, async (req, res) => {
    const userDetail= await User.findOne({_id: req.userId})
    if(!userDetail)
        return res.status(411).json({message: "User not exist!"})

    res.status(200).json({user: userDetail})
})

module.exports= userRouter 