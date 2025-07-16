import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import problemRoutes from "./routes/problem.routes.js"
import cookieParser from 'cookie-parser'
dotenv.config()
const app=express()
const PORT=process.env.PORT || 8080
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("hello ❤️")
})

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/problems",problemRoutes)
app.listen(PORT,()=>{
    console.log("Server is up and running")
})