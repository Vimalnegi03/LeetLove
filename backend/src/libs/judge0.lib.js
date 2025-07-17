import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'
export const getJudge0LanguageId=(language)=>{
const languageMap={
    "JAVA":62,
    "PYTHON":71,
    "JAVASCRIPT":63
}
return languageMap[language.toUpperCase()] || null
}

export const submitBatch=async (submissions)=>{
const {data} =await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base_64_encoded=false`,{submissions})
console.log(data)
return data ///is pehi hit mai hamko array of tokens milenge
}
const sleep=(ms)=>{
    new Promise((resolve) => setTimeout(resolve, ms))
}
export const poolBatchResults=async(tokens)=>{
while(true){
    const{data}=await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
        params:{
            tokens:tokens.join(","),
            base64_encoded:false

        }
    })
    const results=data.submissions
    const isAllDone=results.every((r)=>r.status.id!==1&r.status.id!==2)
    if(isAllDone){
        return results
    }
    await sleep(1000)
}
}

export const getLanguageName=(language_id)=>{
   const LANGUAGE_NAMES={
    74:"TypeScript",
    63:"JavaScript",
    71:"Python",
    62:"Java",
   }
   return LANGUAGE_NAMES[language_id] || "Unknown"
}