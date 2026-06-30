import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log("connected")
    } catch (error) {
        throw error
    }
}

export default connectDB