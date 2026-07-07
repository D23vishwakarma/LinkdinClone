import express from 'express'
import veriftAuth from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
import { comment, createPost, getPosts, like } from '../controllers/post.controller.js';

export const postRouter=express.Router();

postRouter.post("/createpost",veriftAuth,upload.single("image"),createPost);
postRouter.get("/getpost",veriftAuth,getPosts);
postRouter.get("/like/:id",veriftAuth,like);
postRouter.post("/comment/:id",veriftAuth,comment);