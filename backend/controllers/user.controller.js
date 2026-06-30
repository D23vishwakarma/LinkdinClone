import { ApiError } from "../config/apiError.js";
import { ApiResponse } from "../config/apiResponse.js";
import { asyncHandler } from "../config/asyncHandler.js";
import { User } from "../models/user.model.js";

export const getCurrentUser=asyncHandler(async(req,res)=>{
    const user= await User.findById(req.userId).select("-password");
    if(!user){
        throw new ApiError(400,"User not found");
    }
    return res.status(200).json(
        new ApiResponse(200,user,"User found successfully")
    )
})