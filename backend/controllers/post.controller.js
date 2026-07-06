import { ApiResponse } from "../config/apiResponse.js";
import { asyncHandler } from "../config/asyncHandler.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { Post } from "../models/post.model.js";

export const createPost = asyncHandler(async (req, res) => {
    const { description } = req.body;
    let imageUrl = "";

    if (req.file) {
        imageUrl = await uploadOnCloudinary(req.file.path);
        if (!imageUrl) {
            imageUrl = ""; // upload failed, uploadOnCloudinary returns null on error
        }
    }

    const post = await Post.create({
        author: req.userId,
        description,
        image: imageUrl
    });

    return res.status(200).json(
        new ApiResponse(200, post, "Posted Successfully")
    );
});

export const getPosts=asyncHandler(async(req,res)=>{
    const post=await Post.find().populate("author", "firstName lastName profileImage headline")

    return res.status(200).json(
        new ApiResponse(200,post,"Showing all posts")
    )
})