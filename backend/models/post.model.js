import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String,
        default: ""
    },
    image: { type: String },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            content: { type: String },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }

        }
    ]


}, { timestamps: true })

export const Post=mongoose.model("Post",postSchema);