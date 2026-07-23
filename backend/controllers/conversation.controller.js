import { sensitiveHeaders } from "http2";
import { ApiError } from "../config/apiError.js";
import { ApiResponse } from "../config/apiResponse.js";
import { asyncHandler } from "../config/asyncHandler.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const getConversation=asyncHandler(async(req,res)=>{
    const conversation=await Conversation.find({
        participants:req.userId
    }).populate("participants","firstName lastName profileImage headline username").populate("lastMessage","content sender createdAt").sort({ updatedAt: -1 });
    if(!conversation){
        throw new ApiError(400,"Conversation not found")
    }
    return res.status(200).json(
        new ApiResponse(200,conversation,"Conversations fetched successfully")
    )
})
export const getMessages=asyncHandler(async(req,res)=>{
    const {conversationId}=req.params
    const conversation=await Conversation.findOne({
        _id:conversationId,
        participants:req.userId
    })
    if(!conversation){
        throw new ApiError(400,"Conversation not found")
    }
    const message =await Message.find({
        conversationID:conversationId
    }).populate("sender","fistName lastName profileImage").sort({createdAt: 1})

    return res.status(200).json(
        new ApiResponse(200,message,"message fetched successfully")
    )
})
export const sendMessage=asyncHandler(async(req,res)=>{
    const {receiverId}=req.params
    const senderId=req.userId
    const {content}=req.body
    if(!content || content.trim()===""){
        throw new ApiError(404,"content can not be empty")
    }

    let conversation=await Conversation.findOne({
        participants:{
            $all:[senderId,receiverId]
        }
    })
    if(!conversation){
        conversation=await Conversation.create({
            participants:[senderId,receiverId]
        })
    }
    const message=await Message.create({
        sender:senderId,
        receiver:receiverId,
        conversationID:conversation._id,
        content:content.trim()
    })
    conversation.lastMessage=message._id
    await conversation.save()
    const populatedMessage=await Message.findById(message._id).populate("sender","firstName lastName profileImage")
    return res.status(201).json(
        new ApiResponse(201,populatedMessage,"Message sent Successfully")
    )
})
export const markMessageAsRead=asyncHandler(async(req,res)=>{
    const {conversationId}=req.params
    const conversation=await Conversation.findOne({
        _id:conversationId,
        participants:req.userId
    })
    if(!conversation){
        throw new ApiError(404,"Conversaton  not found")
    }
    await Message.updateMany({
        conversationID:conversationId,
        receiver:req.userId,
        isRead:false
    },
        {
            $set:{
                isRead:true
            }
        }
    )
    return res.status(200).json(
        new ApiResponse(200,{},"message readed")
    )
})
