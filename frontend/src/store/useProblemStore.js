import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
export const useProblemStore=create((set,get)=>({
problems:[],
problem:null,
isProblemsLoading:false,
isProblemLoading:false,
solvedProblems:[],

getAllProblem:async()=>{
  try {
      set({isProblemLoading:true});
  const res=await axiosInstance.get("problems/get-problems")
  set({problems:res.data.problems})
  } catch (error) {
    console.log(error.message)
    toast.error("failed to fetch problems")
  }
  finally{
    set({isProblemLoading:false})
  }
},

getProblemById:async(id)=>{
    set({isProblemLoading:true});
   try {
     const res=await axiosInstance.get(`problems/get-problems/${id}`)
     set({problem:res.data.problem})
     toast.success("problem fetched successfully")
   } catch (error) {
    console.log(error.message)
    toast.error("fail to fetch problems")
   }
   finally{
    problem.isProblemLoading = false
   }
},
getSolvedProblemsByUser:async()=>{

    try {
        const res=await axiosInstance.get(`problems/get-solved-problems`)
        set({problems:res.data.problems})
    } catch (error) {
        console.log("errors in fetchinh solved problems")
        toast.error("failed to fectch problems")
    }
}
}))