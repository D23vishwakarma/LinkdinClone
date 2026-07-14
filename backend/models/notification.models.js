import mongoose from "mongoose";
const notiSchema=new mongoose.Schema({
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    type:{
        type:String,
        enum:["like","comment","connectionAccepted","connectionRequest"]
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    relatedPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }
},{timestamps:true})

export const Notification=mongoose.model("Notification",notiSchema);