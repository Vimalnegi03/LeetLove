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
    return res.status(400).json({error:error.message})
}
}


export const getProblem=async(req,res)=>{
    const {id} =req.params
    if(!id)
    {
         return res.status(404).json({error:" Please provide a valid id"})
    }
    try {
        const problem= await db.problem.findUnique(
            {
                where:{
                    id:id
                }
            }
        );
        console.log(problem);
        
        if(!problem)
        {
            return res.status(404).json({error:" No problem found"})
        }
        res.status(200).json({message:"Problem fetched successfully",problem,success:true})
    } catch (error) {
        return res.status(404).json({error:error.message})
    }

}

export const getAllProblems=async(req,res)=>{
     try {
        const problems= await db.problem.findMany();
        console.log(problems);
        
        if(!problems)
        {
            return res.status(404).json({error:" No problem found"})
        }
        res.status(200).json({message:"Problems fetched successfully",problems,success:true})
    } catch (error) {
        return res.status(500).json({error:error.message})
    }


}
export const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Please provide a valid ID" });
  }

  // Only admins allowed to update
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "You are not allowed to access this route", success: false });
  }

  try {
    const existingProblem = await db.problem.findUnique({ where: { id } });

    if (!existingProblem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Validate reference solutions via Judge0
    for (const [language, solutionCode] of Object.entries(referenceSolutions || {})) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res.status(400).json({
          message: `This language "${language}" is not supported`,
          success: false
        });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output
      }));

      const submissionResult = await submitBatch(submissions);
      const tokens = submissionResult.map((res) => res.token);
      const results = await poolBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res.status(400).json({
            message: `Test case ${i + 1} failed for language "${language}"`,
            expected: testcases[i].output,
            received: result.stdout,
            status: result.status.description,
            stderr: result.stderr
          });
        }
      }
    }

    // Proceed to update after passing all validations
    const updatedProblem = await db.problem.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(difficulty && { difficulty }),
        ...(tags && { tags }),
        ...(examples && { examples }),
        ...(constraints && { constraints }),
        ...(testcases && { testcases }),
        ...(codeSnippets && { codeSnippets }),
        ...(referenceSolutions && { referenceSolutions })
      }
    });

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem
    });

  } catch (error) {
    console.error("Error updating problem:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Please provide an ID" });
  }

  try {
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      return res.status(404).json({ error: "No problem found with the given ID" });
    }

    await db.problem.delete({ where: { id } });

    return res.status(200).json({
      message: "Problem deleted successfully",
      success: true
    });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return res.status(500).json({ error: error.message });
  }
};


export const solvedProblems=async(req,res)=>{

    const solvedProblems=await db.problem.findMany({
        where:{

        }
    })
}