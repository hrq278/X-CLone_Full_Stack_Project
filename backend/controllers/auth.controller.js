import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generatetoken.js";

const userSignUp = async(req,res)=>{

    try {
        const { username, email, password, fullName } = req.body;

        if (!username || !email || !password || !fullName) {
        return res.status(400).json({ error: "All fields are required" });
        }
        if (password.length < 6 ) {
        return res.status(400).json({ error: "Password Must be at least 6 characters long" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
        }


        const existingUsername = await User.findOne({username})
        if (existingUsername ) {
            return res.status(400).json({error: "the Username is already Exist"})
        }
        const existingEmail= await User.findOne({email})
        if (existingEmail) {
            return res.status(400).json({error: "the Email is already Exist"})
        }

        // hashPasswordUsingBCRYPTJS
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const createdUser = new User({
            username,
            fullName,
            email,
            password:hashedPassword,
        })

        if (createdUser) {
            generateTokenAndSetCookie(createdUser._id, res)
            await createdUser.save();

            return res
            .status(201)
            .json({
            message: "User is Successfully Created",
            _id: createdUser._id,
            username: createdUser.username,
            fullName: createdUser.fullName,
            email: createdUser.email,
            follower: createdUser.follower,
            following: createdUser.following,
            bio:createdUser.bio,
            link:createdUser.link,
            profileImage:createdUser.profileImage,
            coverImage:createdUser.coverImage
             }) 
        } else {
            return res.status(400).json({ error: "Invalid User Data" });

        }

        
       
    } catch (error) {
        console.log("Signup Error", error)
        return res.status(500)
        .json({
            error: "Internal Server Error",
            message: "error in signing up new User",
            success: false
        })
    }


}

const userLogin = async(req,res)=>{
    
    try {

        const{ username, password} = req.body || {};

        const user = await User.findOne({username})
        
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid Credentials"})
        }

        generateTokenAndSetCookie(user._id, res)

        
        return res
        .status(200)
        .json({
        message: "User is Successfully Logged In",
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        follower: user.follower,
        following: user.following,
        bio:user.bio,
        link:user.link,
        profileImage:user.profileImage,
        coverImage:user.coverImage
            }) 



    } catch (error) {
     console.log("Login Error", error)
        return res.status(500)
        .json({
            error: "Internal Server Error",
            message: "error in Logging in User",
            success: false
        })
    }
}

const userLogout = async(req,res)=>{
    try {
        res.cookie("jwt","", {maxAge: 0});
        res.status(200).json({message: "LoggedOut Successfully"})
    } catch (error) {
         console.log("Logout Error", error)
        return res.status(500)
        .json({
            error: "Internal Server Error",
            message: "error in Logging out User",
            success: false
        })
    }
}

const getMe = async(req,res)=>{
 try {

    const user = await User.findById(req.user._id).select("-password")
    res.status(200)
    .json(user)



 } catch (error) {
    console.log("Error in Getting the User", error)
    return res.status(500)
    .json({
        error: "Internal Server Error",
        message: "error in getting User",
        success: false
    })
 }   
}

export{
    userLogin,
    userSignUp,
    userLogout,
    getMe
}