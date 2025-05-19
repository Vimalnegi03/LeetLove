import jwt from 'jsonwebtoken'
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