const mongoose= require('mongoose')
const { Schema } = require('zod')

const url= "" // Add your mongoDB connection string

const connectDB= async () => {
    try{
        await mongoose.connect(url)
        console.log("Database connected!")
    } catch (error) {
        console.log("Database connection error: ", error)
        process.exit(1)
    }
}

const userSchema= new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})

const accountSchema= new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const User= mongoose.model("User", userSchema)
const Account= mongoose.model("Account", accountSchema)

module.exports= {connectDB, User, Account}