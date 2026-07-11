import express from 'express'
import { getCurrentUser, getProfile, updateProfile } from '../controllers/user.controller.js';
import veriftAuth from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
const userRouter=express.Router();
userRouter.get("/currentuser",veriftAuth,getCurrentUser)
userRouter.put("/updateprofile",veriftAuth,upload.fields([
    {name:"profileImage",maxCount:1},
    {name:"coverImage",maxCount:1}
]),updateProfile);
userRouter.get("/getprofile/:username",veriftAuth,getProfile)

export default userRouter