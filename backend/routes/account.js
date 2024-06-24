const express= require('express')
const { authMiddleware }= require('../middleware')
const { Account, User }= require('../db')
const zod= require('zod')
const { default: mongoose } = require('mongoose')

const accountRouter= express.Router()

const transferSchema= zod.object({
    to: zod.string(),
    amount: zod.number()
})

accountRouter.get("/balance", authMiddleware, async (req, res) => {
    const userAccData= await Account.findOne({userId: req.userId})
    
    res.status(200).json({balance: userAccData.balance})
})

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
    const { success }= transferSchema.safeParse(req.body)
    if(!success)
        return res.status(411).json({message: "Provide correct transfer detail!"})

    const session= await mongoose.startSession()
    session.startTransaction()

    const fromUserAcc= await Account.findOne({userId: req.userId}).session(session)
    if(!fromUserAcc || fromUserAcc.balance < req.body.amount){
        await session.abortTransaction()
        return res.status(400).json({message: "Insufficient balance!"})
    }
    
    await Account.updateOne({userId: req.userId}, { $inc: { balance: -req.body.amount}} ).session(session)

    const toUserAcc= await Account.findOne({userId: req.body.to}).session(session)
    if(!toUserAcc){
        await session.abortTransaction()
        return res.status(400).json({message: "Invalid aacount!"})
    }

    await Account.updateOne({userId: req.body.to}, { $inc: { balance: req.body.amount}}).session(session)

    await session.commitTransaction()
    res.status(200).json({message: "Transfer successful"})
})

module.exports= accountRouter