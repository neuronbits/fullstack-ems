import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("MongoDB connected"))
        // mongoose.connection.on("error", (error) => {
        //     console.log(error)
        // })
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        console.error("Database connection failed:", error.message)
        // console.log(error)
        // process.exit(1)
    }
}

export default connectDB;