import { poolBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const executeCode=async(req,res)=>{
    try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;
      const userId=req.user.id;
      //Validating test cases -:
      if(!Array.isArray(stdin)|| stdin.length===0 || !Array.isArray(expected_outputs)||expected_outputs.length!==stdin.length) {
       return res.status(400).json({
        error:"Invalid or missing test cases"
       })
      }
      //Prepare each test cases for batch0 submission
      const submissions=stdin.map((input)=>({
        source_code,
        language_id,
        stdin:input,
      }))

      //3 Send this batch of submission to judge0
      const submitResponse=await submitBatch(submissions)
      const tokens=submitResponse.map((res)=>res.token);

      //4 Pool judge0 for all submitted test cases
      const results =await poolBatchResults(tokens);
      

      }
       catch (error) {
        
      }
    }