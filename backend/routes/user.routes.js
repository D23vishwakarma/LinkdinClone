import express from 'express'
import { getCurrentUser, updateProfile } from '../controllers/user.controller.js';
import veriftAuth from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
const userRouter=express.Router();
userRouter.get("/currentuser",veriftAuth,getCurrentUser)
userRouter.put("/updateprofile",veriftAuth,upload.fields([
    {name:"profileImage",maxCount:1},
    {name:"coverImage",maxCount:1}
]),updateProfile);

export default userRouter