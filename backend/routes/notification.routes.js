import express from 'express'
import veriftAuth from '../middlewares/auth.middleware.js';
import { deleteAllNotification, deleteNotification, getNotification } from '../controllers/notification.controller.js';
export const notiRouter=express.Router();
notiRouter.get("/get",veriftAuth,getNotification);
notiRouter.delete("/delete/:id",veriftAuth,deleteNotification);
notiRouter.delete("/clearall",veriftAuth,deleteAllNotification);