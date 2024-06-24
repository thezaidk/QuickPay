const express = require("express");
const cors= require('cors')
const mainRouter= require("./routes/index")
const { connectDB }= require("./db")

const app= express()
const PORT= 3000

app.use(cors())
app.use(express.json())
app.use("/api/v1", mainRouter)

app.listen(PORT, (err) => {
    if(err) console.log(err)
    console.log("Server listening on PORT ", PORT)
    connectDB()
})