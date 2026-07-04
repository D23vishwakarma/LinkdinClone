import { asyncHandler } from "../config/asyncHandler";
import { uploadOnCloudinary } from "../config/cloudinary";
import { Post } from "../models/post.model.js";

export const createPost=asyncHandler(async(req,res)=>{
    const {description}=req.body;

    if(req.file){
        const image=await uploadOnCloudinary(req.file.path)
        const post=await Post.create({
            author:req.userId,
            description,
            image
        })
    }
    else{
        const post=await Post.create({
            authod:req.userId,
            description,
            image
        })
    }
    return res.status(200).json(
        new ApiResponse(200,post,"Posted Successfully")
    )
})