import express from 'express'
import { getCurrentUser } from '../controllers/user.controller.js';
import veriftAuth from '../middlewares/auth.middleware.js';
const userRouter=express.Router();
userRouter.get("/currentuser",veriftAuth,getCurrentUser)

export default userRouter