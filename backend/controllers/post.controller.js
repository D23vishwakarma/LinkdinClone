import { ApiError } from "../config/apiError.js";
import { ApiResponse } from "../config/apiResponse.js";
import { asyncHandler } from "../config/asyncHandler.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { io } from "../index.js";
import { Notification } from "../models/notification.models.js";
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

export const getPosts = asyncHandler(async (req, res) => {
    const post = await Post.find().populate("author", "firstName lastName profileImage headline username").populate("comments.user", "firstName lastName profileImage headline ").sort({createdAt: -1})

    return res.status(200).json(
        new ApiResponse(200, post, "Showing all posts")
    )
})

export const like = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(400, "Post Not Found");
    }

    if (post.likes.some(id => id.toString() === userId.toString())) {
        post.likes = post.likes.filter(
            id => id.toString() !== userId.toString()
        );
    } else {
        post.likes.push(userId);
        if (post.author != userId) {
            const notification = await Notification.create({
                receiver: post.author,
                type: "like",
                sender: userId,
                relatedPost: postId
            })
        }
    }
    await post.save();
    io.emit("likeUpdated", { postId, likes: post.likes })


    return res.status(200).json(
        new ApiResponse(200, post, "Post like updated successfully")
    );
});
export const comment = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const userId = req.userId;
    const { content } = req.body;

    console.log("postId:", postId);
    console.log("userId:", userId);
    console.log("content:", content);
    const post = await Post.findByIdAndUpdate(postId, {
        $push: {
            comments: { content, user: userId }
        }
    }, { new: true }).populate("comments.user", "firstName lastName headline profileImage username")
    if (post.author != userId) {
        const notification = await Notification.create({
            receiver: post.author,
            type: "comment",
            sender: userId,
            relatedPost: postId
        })
    }
    io.emit("commentAdded", { postId, comment: post.comments })

    return res.status(200).json(
        new ApiResponse(200, post, "Comments added successfully")
    )
})