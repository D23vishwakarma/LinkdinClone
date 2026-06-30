import jwt from 'jsonwebtoken'
import { asyncHandler } from '../config/asyncHandler.js'
import { ApiError } from '../config/apiError.js';
import { User } from '../models/user.model.js';
const veriftAuth=asyncHandler(async(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            throw new ApiError(400,"Unauthorised access")
        }
        const verifytoken=jwt.verify(token,process.env.JWT_SECRET)
         const user = await User.findById(verifytoken.userId).select("-password");

        if (!user){
        throw new ApiError(401, "User not found");
        }
        req.userId = user._id;
        next();
    } catch (error) {
        throw new ApiError(400,error?.message||"Invalid access")
    }
})

export default veriftAuth