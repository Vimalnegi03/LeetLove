import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../libs/db.js'
import { UserRole } from '../generated/prisma/index.js'

import dotenv from 'dotenv'

import fs from "fs";
import cloudinary from "../fileUpload/cloudinary.js";
import upload from "../fileUpload/upload.js";
import { log } from 'console'
dotenv.config()
export const registerUser=async(req,res)=>{
    const {name,email,password}=req.body
    try {
        const filePath = req.file.path;
        const result = await cloudinary.uploader.upload(filePath, {
          folder: "leetlove",
        });
    
        fs.unlinkSync(filePath);
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
            role:UserRole.USER,
            image:result.secure_url
        }
    })
    const token=jwt.sign({id:newUser.id,role:newUser.role},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY})
    res.cookie("token",token,{httpOnly:true,
      secure:true,
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
      secure:true,
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
            email:user.email,
            userId:req.user.id,
            image:user.image
        }});
    } catch (error) {
        return res.status(400).json({message:error.message,success:false})
    }

}


export const updateUser = async (req, res) => {
  const userId = req.user?.id; // or however you get the logged-in user ID
  const { name, email, password } = req.body;
  console.log(name)
  let updatedData = {};

  try {
    // Ensure user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user)
      return res.status(404).json({ message: "User not found", success: false });

    // Optional: update name/email
    if (name) updatedData.name = name.trim();
    if (email) updatedData.email = email.trim();

    // Optional: update password
    if (password && password.length >= 6) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    // Optional: update image if there is a file uploaded
    if (req.file && req.file.path) {
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "leetlove",
      });
      // Delete temp file
      fs.unlinkSync(req.file.path);
      // Optional: delete previous image in Cloudinary (if you store public_id)
      // if (user.imagePublicId) { await cloudinary.uploader.destroy(user.imagePublicId); }
      updatedData.image = result.secure_url;
      // Optionally: updatedData.imagePublicId = result.public_id;
    }

    // Update user in database
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updatedData,
    });

    res.status(200).json({
      message: "User updated successfully",
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        image: updatedUser.image,
      },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Unable to update user", success: false });
  }
};
