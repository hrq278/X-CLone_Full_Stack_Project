import { Notification } from "../models/notification.model.js";

const notification = async (req,res) => {
    try {
        const userId = req.user._id

        const notification = await Notification.find({ to: userId}).populate({
            path: "from",
            select: "username profileImage"
        });

        await Notification.updateMany({ to:userId}, {read: true})

        return res.status(200).json(notification)
        
    } catch (error) {
    console.log("Error in notification : ", error.message)
    return res.status(500).json({message:"internal server error",error: error.message})   
  
    }
}

const deleteNotification = async (req,res) => {
    try {
        const userId = req.user._id

        await Notification.deleteMany({ to: userId})

        return res.status(200).json({message: "Notification deleted Successfully"})

    } catch (error) {
    console.log("Error in Delete Notification : ", error.message)
    return res.status(500).json({message:"internal server error",error: error.message})   
  
    }
}

export{
     notification,
     deleteNotification
}