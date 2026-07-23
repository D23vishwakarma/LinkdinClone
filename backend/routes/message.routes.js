import express from 'express'
import { getConversation, getMessages, markMessageAsRead, sendMessage } from '../controllers/conversation.controller.js';
import veriftAuth from '../middlewares/auth.middleware.js';
export const convoRouter=express.Router();
convoRouter.get("/getconversation",veriftAuth,getConversation);
convoRouter.get("/getmessage/:conversationId",veriftAuth,getMessages);
convoRouter.post("/send/:receiverId",veriftAuth,sendMessage);
convoRouter.put("/read/:conversationId",veriftAuth,markMessageAsRead);