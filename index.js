import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./src/config/connectDB.js"
import postRoute from "./src/routes/postRoute.js"
import webHookRoute from "./src/routes/webHookRoute.js"
import userRoute from "./src/routes/userRoute.js"
import { clerkMiddleware } from "@clerk/express"
import cors from "cors"
import commentRoute from "./src/routes/commentRoute.js"
connectDB()
const app = express()
// webhook route place before express to avoid body parser error
app.use("/webhook", webHookRoute)
app.use(clerkMiddleware(process.env.CLIENT_URL_ROOT))
app.use(cors())
app.use(express.json())

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, ")
    next()
})
app.use(express.urlencoded({ extended: true }))

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500)
    res.json({
        status: err.status || "error",
        message: err.message || "Internal Server Error",
        stack: err.stack,
    })
})

app.use("/posts", postRoute)
app.use("/comments", commentRoute)
app.use("/user", userRoute)

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})