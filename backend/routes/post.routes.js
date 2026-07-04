import express from 'express'
import veriftAuth from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import { createPost } from '../controllers/post.controller.js';

const postRouter=express.Router();

postRouter.post("/createpost",veriftAuth,upload.single("image"),createPost);