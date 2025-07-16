import { db } from "../libs/db.js";
import { getJudge0LanguageId,submitBatch,poolBatchResults } from "../libs/judge0.lib.js";
export const createProblem=async(req,res)=>{
//going to get all data from request body
//going to check user role once again
//loop through each and every solution for different languages available
const {title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions}=req.body
if(req.user.role!=="ADMIN")
    return res.status(403).json({message:"you are not allowed to access this routes",success:false})
try {
   for(const[language,solutionCode] of Object.entries(referenceSolutions)){
    const languageId=getJudge0LanguageId(language)
    if(!languageId)
    {
        return res.status(400).json({message:`this language ${language} is not supported`,success:false})
    }
    const submissions=testcases.map(({input,output})=>({
      source_code:solutionCode,
      language_id:languageId,
      stdin:input,
      expected_output:output
    }))
    const submissionResult=await submitBatch(submissions)
    const tokens=submissionResult.map((res)=>res.token)
    const results=await poolBatchResults(tokens)
    for(let i=0;i<results.length;i++)
    {
        
        const result=results[i]
        if(result.status.id!==3)
        {
            return res.status(400).json({message:`test case ${i+1} failed for ${language}`})
        }
    }
}
    //save problem to the database
    const newProblem=await db.problem.create({
        data:{
            title,description,difficulty,tags,examples,constraints,testcases,codeSnippets,referenceSolutions,userId:req.user.id
        }
    })
        return res.status(201).json({
      sucess: true,
      message: "Message Created Successfully",
      problem: newProblem,
    });
   } 
 catch (error) {
    return res.status(400).json({message:error.message})
}
}


export const getProblem=async(req,res)=>{

}

export const getAllProblems=async(req,res)=>{

}
export const updateProblem=async(req,res)=>{

}

export const deleteProblem=async(req,res)=>{}

export const solvedProblems=async(req,res)=>{}