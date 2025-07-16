import express from 'express'
import { jwtVerify,isAdmin } from '../middlewares/auth.middleware.js'
import { createProblem, deleteProblem, getAllProblems, getProblem, solvedProblems, updateProblem } from '../controllers/problem.controller.js'
const router=express.Router()
router.post('/create-problem',jwtVerify,isAdmin,createProblem)
router.get("/get-problems",jwtVerify,getAllProblems)
router.get('/get-problems/:id',jwtVerify,getProblem)
router.put('/update-problem/:id',jwtVerify,isAdmin,updateProblem)
router.delete("/delete-problem/:id",jwtVerify,isAdmin,deleteProblem)
router.get("/get-solved-problems",jwtVerify,solvedProblems)
export default router