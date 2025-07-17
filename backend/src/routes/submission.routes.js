import express from "express"
import { jwtVerify } from "../middlewares/auth.middleware.js"
import { getAllSubmission,getAllSubmissionForProblem,getSubmissionsforProblem } from "../controllers/submission.controller.js"
const submissionRouter=express.Router()
submissionRouter.get("/get-all-submissons",jwtVerify,getAllSubmission)
submissionRouter.get("/get-submission/:problemId",jwtVerify,getSubmissionsforProblem)
submissionRouter.get("/get-submission-count/:problemId",jwtVerify,getAllSubmissionForProblem)
export default submissionRouter