import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"

import {v2 as cloudinary} from "cloudinary"

import connectDB from "./db/dbconnect.js"


//importing routes
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import notificationRoutes from "./routes/notification.route.js"

const app = express()
const PORT = process.env.PORT || 5000
// const __dirname = path.resolve() 

//cors 
 const allowedOrigins = [
  'https://x-clone-full-stack-frontend-wpp3.vercel.app',
  'http://localhost:3000',
  process.env.CORS_ORIGIN
].filter(Boolean); // removes undefined or empty

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
//dot env configuration
dotenv.config(
    {
        path:".env"
    }
)
//Cloudinary configuration

cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET
})


//using middleware for the parsing the data through json and form
app.use(express.json({limit : '10mb'}))
app.use(express.urlencoded({limit : '10mb',extended: true}))
app.use(cookieParser())

//port configuration



//Api Routes defined
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/post", postRoutes)
app.use("/api/v1/notifications",notificationRoutes)


//for production 
// if (process.env.NODE_ENV.trim() === "production") {
//     app.use(express.static(path.join(__dirname,"/frontend/dist")))

//     app.get("*",(req,res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
// })

// }

// console.log(`${process.env.MONGODB_URI}`)

app.listen(5000,()=>{
    console.log(`server is listening to ${PORT}`) 
    connectDB();
})

export default app;

