
import { db } from "../libs/db.js"
export const getAllSubmission=async(req,res)=>{
try {
    const id=req.user.id
    const submissions=db.Submission.findMany({
        where: {
            userId:id
        }
    })
   
    res.status(200).json({success:true,message:"successfully fetched submissions",submissions})
} catch (error) {
    return res.status(400).json({message:error.message})
}
}

export const getSubmissionsforProblem=async(req,res)=>{
try {
    const userId=req.user.id
    const problemId=req.params.problemId
    if(!problemId)
        return res.status(400).json({success:false,error:"please provide a valid problemId"})
    const submissions=await db.Submission.findMany({
        where:{
            userId:userId,
            problemId:problemId
        }
    })
    res.status(200).json({success:true,message:"Successfully fteched all submission for a problem",submissions})
} catch (error) {
    return res.status(500).json({error:error.message})
}

}

export const getAllSubmissionForProblem=async(req,res)=>{
try {
    const userId=req.user.id
    const problemId=req.params.problemId
    if(!problemId)
        return res.status(400).json({success:false,error:"please provide a valid problemId"})
    const submission=await db.Submission.count({
        where:{
           
            problemId:problemId
        }
    })
    
    res.status(200).json({success:true,message:"Successfully fteched number of times a problem was submitted",count:submission})
} catch (error) {
    return res.status(500).json({error:error.message})
}

}