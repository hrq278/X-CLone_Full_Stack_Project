import { User } from "../models/user.model.js"
import { Notification } from "../models/notification.model.js"
import bcrypt from "bcryptjs"
import {v2 as cloudinary} from "cloudinary"

const getUserProfile = async(req, res) => {
    try {
        const {username} = req.params

        const user = await User.findOne({username}).select("-password")

        if (!user) return res.status(404).json({error:"User not found"});

        res.status(200).json(user)

    } catch (error) {
        console.log("error in getUserProfile :", error.message)
        res.status(500).json({error:error.message})
    }
}

const followUnfollowUser = async(req, res) => {
    try {
        const {id} = req.params

        const userToModify = await User.findById(id)
        const currentUser = await User.findById(req.user._id)

        if (id.toString() === req.user._id.toString()) {
        return res.status(404).json({error: "You Cannot follow or unfollow yourself"})
        }

        if (!userToModify || !currentUser) {
        return res.status(404).json({error:"User not Found"})
        }

        const isFollowing = currentUser.following.includes(id)

        if (isFollowing) {
            //unfollow the User
            await User.findByIdAndUpdate(id,{ $pull : { follower: req.user._id}})
            await User.findByIdAndUpdate(req.user._id,{ $pull : { following: id}})

    //TODO return the id of the user as a response

        return res.status(200).json({message : "User unfollowed Successfully"})
            
        } else {
            //follow the User
            await User.findByIdAndUpdate(id,{ $push : { follower: req.user._id}})
            await User.findByIdAndUpdate(req.user._id,{ $push : { following: id}})

            //Send Notification to User

            const newNotification = new Notification({
                type:'follow',
                from: req.user,
                to:userToModify._id
            })

            await newNotification.save()

    //TODO return the id of the user as a response

        return res.status(200).json({ message: "User followed successfully" });
        }
        
    } catch (error) {
        console.log("error in followUnfollowUser :", error.message)
        return res.status(500).json({error:error.message}) 
    }
}

const updateUserProfile = async(req, res) => {
    try {
        const {fullName, currentPassword, newPassword, bio, link} = req.body;

        let {profileImage, coverImage} = req.body
        const userId = req.user._id

        let user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({error: "User not found"})
        }

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({error: "Please provide current and new password"})
        }
        

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword,user.password)
            if (!isMatch) {
                return res.status(400).json({error: "please enter correct current password"})
            }  

            if (newPassword.length < 6) {
            return res.status(400).json({error: "please enter password atleast 6 characters long"})
            }

            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(newPassword,salt)
        }
        


        /////////////////////////////////////////////////////////////

        if (profileImage) {
            if (user.profileImage) {
                await cloudinary.uploader.destroy(user.profileImage.split("/").pop().split(".")[0])
            }

            const uploadedResponse = await cloudinary.uploader.upload(profileImage)

            profileImage = uploadedResponse.secure_url

        }
        if (coverImage) {
            if (user.coverImage) {
                await cloudinary.uploader.destroy(user.coverImage.split("/").pop().split(".")[0])
            }

            const uploadedResponse = await cloudinary.uploader.upload(coverImage)

            coverImage = uploadedResponse.secure_url
        }
        user.fullName = fullName || user.fullName
        user.bio = bio || user.bio
        user.link = link || user.link
        user.profileImage = profileImage || user.profileImage
        user.coverImage = coverImage || user.coverImage


        user = await user.save();
        if (!user) {
            return res.status(400).json({error: "Error in Updating profile"})
        }

        //password will be null in response
        user.password = null;

        return res.status(200).json(user)



    } catch (error) {
        console.log("Error in updateUserProfile : ", error.message)
        return res.status(500).json({message:"internal server error",error: error.message})   
    }
}

const getSuggestedUsers = async(req, res) => {
    try {
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select("-password")

        const users = await User.aggregate([
            {
                $match:{
                    _id:{$ne : userId}
                }
            },
            {
                $sample:{size:10}
            }
        ])

        const filteredUser = users.filter(user=>!usersFollowedByMe.following.includes(user._id));

        const suggestedUsers = filteredUser.slice(0,4)

        suggestedUsers.forEach(user=>user.password=null)

        return res.status(200).json(suggestedUsers)

    } catch (error) {
        console.log("Error in getSuggestedUser : ", error.message)
        return res.status(500).json({error: error.message})
    }
}



export{
    updateUserProfile,
    getUserProfile,
    followUnfollowUser,
    getSuggestedUsers
}