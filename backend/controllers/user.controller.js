import { connect } from "http2";
import { ApiError } from "../config/apiError.js";
import { ApiResponse } from "../config/apiResponse.js";
import { asyncHandler } from "../config/asyncHandler.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { User } from "../models/user.model.js";

export const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
        throw new ApiError(400, "User not found");
    }
    return res.status(200).json(
        new ApiResponse(200, user, "User found successfully")
    )
})
export const updateProfile = asyncHandler(async (req, res) => {
    const { firstName, lastName, username, headline, location, gender } = req.body;

    const skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    const education = req.body.education ? JSON.parse(req.body.education) : [];
    const experience = req.body.experience ? JSON.parse(req.body.experience) : [];

    let profileImage;
    let coverImage;

    if (req.files?.profileImage?.[0]?.path) {
        profileImage = await uploadOnCloudinary(req.files.profileImage[0].path);
    }

    if (req.files?.coverImage?.[0]?.path) {
        coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
    }

    const updateData = {
        firstName,
        lastName,
        username,
        headline,
        location,
        education,
        experience,
        skills,
        gender
    };

    if (profileImage) updateData.profileImage = profileImage;
    if (coverImage) updateData.coverImage = coverImage;

    const user = await User.findByIdAndUpdate(
        req.userId,
        updateData,
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, user, "profile updated successfully")
    );
});

export const getProfile=asyncHandler(async(req,res)=>{
    const {username}=req.params;
    const user=await User.findOne({username}).select("-password");
    if(!user){
        throw new ApiError(400,"User doesn't Exists");
    }
    return res.status(200).json(
        new ApiResponse(200,user,"user profile fetched")
    )
})
export const search=asyncHandler(async(req,res)=>{
    const {query}=req.query;
    if(!query){
        throw new ApiError(400,"query is required");
    }
    const user=await User.find({
        $or:[
            {firstName:{$regex:query,$options:"i"}},
            {lastName:{$regex:query,$options:"i"}},
            {username:{$regex:query,$options:"i"}},
            {skills:{$in:[query]}}
            
        ]
    })
    return res.status(200).json(
        new ApiResponse(200,user,"All related profiles")
    )
})
export const getSuggestedUser=asyncHandler(async(req,res)=>{
    const currUser=await User.findById(req.userId).select("connection");
    const suggestedUSer=await User.find({
        _id:{
            $ne:currUser,$nin:currUser.connection
        }
    })
    return res.status(200).json(
        new ApiResponse(200,suggestedUSer,"these are the suggested users")
    )
})