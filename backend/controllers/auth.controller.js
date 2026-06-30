import { asyncHandler } from "../config/asyncHandler.js"
import { ApiError } from "../config/apiError.js";
import { ApiResponse } from "../config/apiResponse.js";
import bcrypt from 'bcryptjs'
import { User } from "../models/user.model.js";
import genToken from "../config/token.js";
export const signUp=asyncHandler(async(req,res)=>{
    const {firstName,lastName,email,password,username}=req.body;
    if (
        [firstName,lastName,email,password,username].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existedUser){
        throw new ApiError(401,"user already exists")
    }
    if(password.length<8){
        throw new ApiError(400,"password must be atleat 8 characters")
    }
    const hashedpassword=await bcrypt.hash(password,10);
    const user=await User.create({
        firstName,
        lastName,
        email,
        password:hashedpassword,
        username
    })

    const token=await genToken(user._id)
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure:process.env.NODE_ENVIRONMENT==="production"
    })
    const createdUser=await User.findById(user._id).select("-password")
    return res.status(201).json(
        new ApiResponse(201,createdUser,"User registered succesfully")
    )
})
export const login=asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body
    if(!(username||email)){
        throw new ApiError(400,"all fiels are required")
    }
    const user=await User.findOne({
        $or:[{username},{email}]
    }
    )
    if(!user){
        throw new ApiError(400,"user does not exist")
    }
    const isMatched=await bcrypt.compare(password,user.password);
    if(!isMatched){
        throw new ApiError(400,"incorrect password")
    }
    const token=await genToken(user._id)
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure:process.env.NODE_ENVIRONMENT==="production"
    })
    const createdUser=await User.findOne(user._id).select("-password")
    return res.status(200).json(
        new ApiResponse(200,createdUser,"User registered succesfully")
    )
})
export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENVIRONMENT === "production"
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "User logged out successfully")
    );
});