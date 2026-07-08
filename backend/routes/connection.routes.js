import express from 'express'
import veriftAuth from '../middlewares/auth.middleware.js';
import { acceptCon, getAllCon, getConReq, getConStatus, rejectCon, removeCon, sendConnection } from '../controllers/connection.controller.js';

export const connectionRouter=express.Router();

connectionRouter.get("/send/:id",veriftAuth,sendConnection);
connectionRouter.get("/accept/:connectionId",veriftAuth,acceptCon);
connectionRouter.get("/reject/:connectionId",veriftAuth,rejectCon);
connectionRouter.get("/getstatus/:userId",veriftAuth,getConStatus);
connectionRouter.get("/remove/:userId",veriftAuth,removeCon);
connectionRouter.get("/getrequests",veriftAuth,getConReq);
connectionRouter.get("/connections",veriftAuth,getAllCon);