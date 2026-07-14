import { ApiResponse } from "../config/apiResponse.js";
import { asyncHandler } from "../config/asyncHandler.js";
import { Notification } from "../models/notification.models.js";

export const getNotification=asyncHandler(async(req,res)=>{
    const notification=await Notification.find({receiver:req.userId}).populate("sender","firstName lastName profileImage username").populate("relatedPost","image description")
    return res.status(200).json(
        new ApiResponse(200,notification,"All notifications are fetched")
    )
})
export const deleteNotification=asyncHandler(async(req,res)=>{
    const {id}=req.params
    await Notification.findOneAndDelete({
        _id:id,
        receiver:req.userId
    })
    return res.status(200).json(
        new ApiResponse(200,{},"All notification is deleted successfully")
    )
})
export const deleteAllNotification=asyncHandler(async(req,res)=>{
    await Notification.deleteMany({
        receiver:req.userId
    })
    return res.status(200).json(
        new ApiResponse(200,{},"All notifications are deleted successfully")
    )
})