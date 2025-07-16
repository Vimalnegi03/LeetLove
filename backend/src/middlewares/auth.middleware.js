import jwt from 'jsonwebtoken'
import { db } from '../libs/db.js'
export const jwtVerify=async(req,res,next)=>{
    const {token}=req.cookies
    if(!token)
        return res.status(400).json({message:"Please provide a token",success:true})
    console.log(token)
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        console.log(decoded)
        req.user=decoded
    } catch (error) {
        return res.status(400).json({message:error.message,success:true})
    }
    next()
}

export const isAdmin=async(req,res,next)=>{
   try {
     const id=req.user.id
    const user= await db.user.findUnique({
         where:{id:id},
         select:{
             role:true
         }
     })
     if(!user || user.role!="ADMIN")
         return res.status(403).json({message:"only admin is allowed to create a problem",success:false})
   } catch (error) {
    return res.status(500).json({message:error.message,success:false})
   }
    next()
}