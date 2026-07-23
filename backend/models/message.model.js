import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    conversationID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    },
    content:{
        type:String,
        trim:true
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export const Message=mongoose.model("Message",messageSchema);