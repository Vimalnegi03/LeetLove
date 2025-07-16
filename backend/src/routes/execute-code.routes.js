import express from 'express'
import { jwtVerify } from '../middlewares/auth.middleware'
import { executeCode } from '../controllers/executeCode.controller.js'
const executionRoute = express.Router()

executionRoute.post("/",jwtVerify,executeCode)



export default executionRoute