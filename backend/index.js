import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/user.routes.js';
import { postRouter } from './routes/post.routes.js';
dotenv.config();

const app= express();
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}
))
const port=process.env.PORT||4000;
app.use("/api/auth/",authRouter)
app.use("/api/user/",userRouter)
app.use("/api/post/",postRouter)
app.get("/",(req,res)=>{
    res.send("helloo whatsup")
})
app.use((err, req, res, next) => {
  return res.status(err.statuscode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || []
  });
});
app.listen(port,(req,res)=>{
    connectDB()
    console.log(`app is running on ${port} port`);
})