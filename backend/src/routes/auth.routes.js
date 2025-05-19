import express from 'express'
import { jwtVerify } from '../middlewares/auth.middleware.js'
import { registerUser,login,logout,check } from '../controllers/auth.controller.js'
const router=express.Router()
router.post("/register",registerUser)
router.post("/login",login)
router.post("/logout",jwtVerify,logout)
router.get("/check",jwtVerify,check)
export default router