import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import problemRoutes from "./routes/problem.routes.js"
import executionRoute from './routes/execute-code.routes.js'
import submissionRouter from './routes/submission.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
dotenv.config()
const app=express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
const PORT=process.env.PORT || 8080
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("hello ❤️")
})

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/problems",problemRoutes)
app.use("/api/v1/execute-code",executionRoute)
app.use("/api/v1/submission",submissionRouter)
app.use("/api/v1/playlist",playlistRouter)
app.listen(PORT,()=>{
    console.log("Server is up and running")
})