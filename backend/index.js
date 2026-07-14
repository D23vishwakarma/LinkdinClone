import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/user.routes.js';
import { postRouter } from './routes/post.routes.js';
import { connectionRouter } from './routes/connection.routes.js';
import http from 'http'
import { Server, Socket } from 'socket.io';
import { notiRouter } from './routes/notification.routes.js';
dotenv.config();

const app= express();
const server=http.createServer(app)
export const io=new Server(server,{cors:({
    origin:"http://localhost:5173",
    credentials:true
})})
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
app.use("/api/connection/",connectionRouter)
app.use("/api/notification/",notiRouter)
export const userSocketMap=new Map();
io.on("connection",(socket)=>{
  // console.log("User connected",socket.id);
    socket.on("register",(userId)=>{
      userSocketMap.set(userId,socket.id)
    })
    socket.on("disconnect",(socket)=>{
    // console.log("user disconnected",socket.id)
  })
})
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
server.listen(port,(req,res)=>{
    connectDB()
    console.log(`app is running on ${port} port`);
})