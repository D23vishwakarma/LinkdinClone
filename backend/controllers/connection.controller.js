import { ApiError } from "../config/apiError.js";
import { ApiResponse } from "../config/apiResponse.js";
import { asyncHandler } from "../config/asyncHandler.js";
import { Connection } from "../models/connection.model.js";
import { User } from "../models/user.model.js";
import { io, userSocketMap } from '../index.js'
import { Notification } from "../models/notification.models.js";

export const sendConnection = asyncHandler(async (req, res) => {
    const { id } = req.params
    const sender = req.userId
    const user = await User.findById(sender)
    if (!user) {
        throw new ApiError(400, "User not found");
    }
    if (sender.toString() === id.toString()) {
        throw new ApiError(400, "You cannot send connection to yourself");
    }
    if (user.connection.some(cid => cid.toString() === id.toString())) {
        throw new ApiError(400, "conncetion already exists")
    }
    const existingCon = await Connection.findOne({
        $or: [
            { sender, receiver: id },
            { sender: id, receiver: sender }
        ],
        status: "pending"
    })
    if (existingCon) {
        throw new ApiError(400, "connection request already present")
    }
    const newReq = await Connection.create({
        sender,
        receiver: id
    })
    const receiverSocketId = userSocketMap.get(id);
    const senderSocketId = userSocketMap.get(sender);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("statusUpdate", { updateduserId: sender, newStatus: "received" })
    }
    if (senderSocketId) {
        io.to(senderSocketId).emit("statusUpdate", { updateduserId: id, newStatus: "pending" })
    }
    const notification=await Notification.create({
                receiver:id,
                type:"connectionRequest",
                sender,
            })
    
    return res.status(200).json(
        new ApiResponse(200, newReq, "User connected")
    )
})

export const acceptCon = asyncHandler(async (req, res) => {
    const { connectionId } = req.params
    const connection = await Connection.findById(connectionId)

    if (!connection) {
        throw new ApiError(400, "Connection not found");
    }
    if (connection.status != "pending") {
        throw new ApiError(400, "connection is processing");
    }
    connection.status = "accepted"
    await connection.save();
    const notification=await Notification.create({
                receiver:connection.sender,
                type:"connectionAccepted",
                sender:req.userId,
            })
    await User.findByIdAndUpdate(req.userId, {
        $addToSet: {
            connection: connection.sender
        }
    })
    await User.findByIdAndUpdate(connection.sender, {
        $addToSet: {
            connection: req.userId
        }
    })
    const receiverSocketId = userSocketMap.get(connection.receiver.toString());
    const senderSocketId = userSocketMap.get(connection.sender.toString());
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("statusUpdate", { updateduserId: connection.sender, newStatus: "disconnect" })
    }
    if (senderSocketId) {
        io.to(senderSocketId).emit("statusUpdate", { updateduserId: req.userId, newStatus: "disconnect" })
    }
    return res.status(200).json(
        new ApiResponse(200, {}, "connection request accepted")
    )
})

export const rejectCon = asyncHandler(async (req, res) => {
    const { connectionId } = req.params
    const connection = await Connection.findById(connectionId)
    if (!connection) {
        throw new ApiError(400, "Connection not found");
    }
    if (connection.status != "pending") {
        throw new ApiError(400, "connection is processing");
    }
    connection.status = "rejected"
    await connection.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "connection request rejected")
    )
})

export const getConStatus = asyncHandler(async (req, res) => {
    const targetUserId = req.params.userId
    const currentUserId = req.userId

    if (!currentUserId) {
        throw new ApiError(401, "Unauthorized - no user id on request")
    }
    if (!targetUserId) {
        throw new ApiError(400, "targetUserId is required")
    }

    const currentUser = await User.findById(currentUserId)
    if (!currentUser) {
        throw new ApiError(404, "Current user not found")
    }

    // Can't check status against yourself
    if (currentUserId.toString() === targetUserId.toString()) {
        throw new ApiError(400, "Cannot check connection status with yourself")
    }

    // Use .some() with string comparison - ObjectId.includes(string) is unreliable
    const alreadyConnected = currentUser.connection.some(
        cid => cid.toString() === targetUserId.toString()
    )

    if (alreadyConnected) {
        return res.status(200).json(
            new ApiResponse(200, { status: "disconnect" }, "connection already exists")
        )
    }

    const pendinReq = await Connection.findOne({
        $or: [
            { sender: currentUserId, receiver: targetUserId },
            { sender: targetUserId, receiver: currentUserId }
        ],
        status: "pending"
    })

    if (pendinReq) {
        if (pendinReq.sender.toString() === currentUserId.toString()) {
            return res.status(200).json(
                new ApiResponse(200, { status: "pending" }, "status is pending")
            )
        } else {
            return res.status(200).json(
                new ApiResponse(200, { status: "received", requestId: pendinReq._id }, "status is pending")
            )
        }
    }

    return res.status(200).json(
        new ApiResponse(200, { status: "+connect" }, "connect status shown")
    )
})

export const removeCon = asyncHandler(async (req, res) => {
    const myId = req.userId
    const friendId = req.params.userId

    await User.findByIdAndUpdate(myId, {
        $pull: {
            connection: friendId
        }
    })
    await User.findByIdAndUpdate(friendId, {
        $pull: {
            connection: myId
        }
    })
    const receiverSocketId = userSocketMap.get(friendId);
    const senderSocketId = userSocketMap.get(myId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("statusUpdate", { updateduserId: myId, newStatus: "connect" })
    }
    if (senderSocketId) {
        io.to(senderSocketId).emit("statusUpdate", { updateduserId: friendId, newStatus: "connect" })
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "connection removed successfully")
    )
})

export const getConReq = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const requests = await Connection.find({ receiver: userId, status: "pending" }).populate("sender", "firstName lastName email username headline profileImage")

    return res.status(200).json(
        new ApiResponse(200, requests, "Connection requests fetched successfully")
    )
})

export const getAllCon = asyncHandler(async (req, res) => {
    const userId = req.userId

    const user = await User.findById(userId).populate("connection", "firstName lastName headline proffileImage username connection")

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(
        new ApiResponse(200, user.connection, "All connection of the user")
    )
})