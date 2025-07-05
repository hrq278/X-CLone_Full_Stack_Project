import {User}  from "../models/user.model.js";
import jwt from "jsonwebtoken"
const protectedRoute = async(req,res,next) => {

    try {
        const token = req.cookies.jwt;
        //console.log("token", token)
        if (!token) {
            return res.status(401).json({error: "Unauthorized: No token Provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        //console.log("decoded", decoded)

        if (!decoded) {
             return res.status(401).json({error: "Unauthorized: Invalid token Provided"})
        }

        const user = await User.findById(decoded.userId).select("-password")
      //  console.log("user", user)

         if (!user) {
             return res.status(401).json({error: "User not Found"})
        }

        req.user = user;
        next()

    } catch (error) {
        console.log("error in protected Routes middleware")
        return res.status(500).json({error: "Internal Server Error"})

    }
}

export default protectedRoute;