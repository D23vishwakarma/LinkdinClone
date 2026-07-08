import { ApiError } from "../config/apiError.js";
import { ApiResponse } from "../config/apiResponse.js";
import { asyncHandler } from "../config/asyncHandler.js";
import { Connection } from "../models/connection.model.js";
import { User } from "../models/user.model.js";

export const sendConnection=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const sender=req.userId
    const user=await User.findById(sender)
    if(!user){
        throw new ApiError(400,"User not found");
    }
    if(sender.toString()===id.toString()){
        throw new ApiError(400,"You cannot send connection to yourself");
    }
    if(user.connection.includes(id)){
        throw new ApiError(400,"conncetion already exists")
    }
    const existingCon=await Connection.findOne({
        $or:[
            {sender,receiver:id},
            {sender:id,receiver:sender}
        ],
        status:"pending"
    })
    if(existingCon){
        throw new ApiError(400,"connection request already present")
    }
    const newReq=await Connection.create({
        sender,
        receiver:id
    })

    return res.status(200).json(
        new ApiResponse(200,newReq,"User connected")
    )
})
export const acceptCon=asyncHandler(async(req,res)=>{
    const {connectionId}=req.params
    const connection=await Connection.findById(connectionId)

    if(!connection){
        throw new ApiError(400,"Connection not found");
    }
    if(connection.status!="pending"){
        throw new ApiError(400,"connection is processing");
    }
    connection.status="accepted"
    await connection.save();
    await User.findByIdAndUpdate(req.userId,{
        $addToSet:{
            connection:connection.sender
        }
    })
    await User.findByIdAndUpdate(connection.sender,{
        $addToSet:{
            connection:req.userId
        }
    })
    return res.status(200).json(
        new ApiResponse(200,{},"connection request accepted")
    )
})
export const rejectCon=asyncHandler(async(req,res)=>{
    const {connectionId}=req.params
    const connection=await Connection.findById(connectionId)
    if(!connection){
        throw new ApiError(400,"Connection not found");
    }
    if(connection.status!="pending"){
        throw new ApiError(400,"connection is processing");
    }
    connection.status="rejected"
    await connection.save();
    
    return res.status(200).json(
        new ApiResponse(200,{},"connection request rejected")
    )
})
export const getConStatus=asyncHandler(async(req,res)=>{
    const targetUserId=req.params.userId
    const currentUserId=req.userId
    const currentUser=await User.findById(currentUserId)
    if(currentUser.connection.includes(targetUserId)){
        return res.status(200).json(new ApiResponse(200,{status:"Disconnect"},"connection laready exists"))
    }
    const pendinReq=await Connection.findOne({
        $or:[
            {sender:currentUserId,receiver:targetUserId},
            {sender:targetUserId,receiver:currentUserId}
        ],
        status:"pending"
    })
    if(pendinReq){
        if(pendinReq.sender.toString()===currentUserId.toString()){
            return res.status(200).json(new ApiResponse(200,{status:"pending"},"status is pending"))
        }else{
            return res.status(200).json(new ApiResponse(200,{status:"received",requestId:pendinReq._id},"status is pending"))
        }
    }

    return res.status(200).json(
        new ApiResponse(200,{status:"connect"},"connect status shown")
    )
})
export const removeCon=asyncHandler(async(req,res)=>{
    const myId=req.userId
    const friendId=req.params.userId

    await User.findByIdAndUpdate(myId,{
        $pull:{
            connection:friendId
        }
    })
    await User.findByIdAndUpdate(friendId,{
        $pull:{
            connection:myId
        }
    })

    return res.status(200).json(
        new ApiResponse(200,{},"connection removed successfully")
    )
})
export const getConReq=asyncHandler(async(req,res)=>{
    const userId=req.userId;
    const requests=await Connection.find({receiver:userId,status:"pending"}).populate("sender","firstName lastName email username headline  proffileImage")

    return res.status(200).json(
        new ApiResponse(200,requests,"Connection requests fetched successfully")
    )
})
export const getAllCon=asyncHandler(async(req,res)=>{
    const userId=req.userId

    const user=await User.findById(userId).populate("connection","firstName lastName headline proffileImage username connection")

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(
        new ApiResponse(200,user.connection,"All connection of the user")
    )
})