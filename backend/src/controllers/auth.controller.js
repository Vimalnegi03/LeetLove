import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../libs/db.js'
import { UserRole } from '../generated/prisma/index.js'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()
export const registerUser=async(req,res)=>{
    const {name,email,password}=req.body
  try {
    if(!name||!email||!password)
        return res.status(400).json({message:"Please enter all the details",success:false})
    const existingUser=await db.user.findUnique({where:{
        email
    }})
    if(existingUser){
        return res.status(400).json({message:"User with this email already exists",success:false})
    }
    const hashedPassword=await bcrypt.hash(password,10)
    const newUser=await db.user.create({
        data:{
            name,
            email,
            password:hashedPassword,
            role:UserRole.USER
        }
    })
    const token=jwt.sign({id:newUser.id,role:newUser.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY})
    res.cookie("token",token,{httpOnly:true,
        maxAge:10*24*60*60*1000,
    })
    res.status(201).json({
        message:"User successfully created",
        success:true,
        user:{
            id:newUser.id,
            name:newUser.name,
            email:newUser.email,
            role:newUser.role
        },
        token
    })
  } catch (error) {
    return res.status(400).json({message:error.message})
  }
}

export const login=async(req,res)=>{
    const {email,password}=req.body
    try {
        if(!email||!password)
            return res.status(400).json({
        message:"all fields are mandatory",
    success:false})
   const user= await db.user.findUnique({
        where:{
            email
        }
    })
    if(!user)
        return res.status.json({message:"user not found",success:false})
    
    const isMatch=await bcrypt.compare(password,user.password)
    if(isMatch)
    {
        const token=jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY})
    res.cookie("token",token,{httpOnly:true,
        maxAge:10*24*60*60*1000,
    })
    res.status(201).json({
        message:"User successfully login",
        success:true,
        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role
        },
        token
    })
    }
    else{
        return res.status(400).json({message:"please enter correct password",success:false})
    }  
    }
    catch (error) {
        return res.status(400).json({message:error.message,success:false})
    }

}

export const logout = async (req, res) => {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // expires immediately
      sameSite: "lax", // adjust based on your use case
      secure: process.env.NODE_ENV === "production", // use secure in production
    });
  
    res.status(200).json({ message: "User logged out successfully", success: true });
  };
  

export const check=async(req,res)=>{
    try {
        const {id}=req.user
        if(!id)
            return res.status(400).json({message:"user not found",success:false})
       const user= await db.user.findUnique({
            where:{
                id
            }
        })
        if(!user)
            return res.status(400).json({message:"User not found",success:false})
        res.status(200).json({message:"user authenticated successfully", success:true,user:{
            role:user.role,
            name:user.name,
            email:user.email
        }});
    } catch (error) {
        
    }

}