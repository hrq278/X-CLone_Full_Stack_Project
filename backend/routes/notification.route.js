import express from "express"
import protectedRoute from "../middlewares/protectedRoute.middleware.js"
import { notification, deleteNotification } from "../controllers/Notification.controller.js"


const router = express.Router()

router.get("/all", protectedRoute, notification)
router.delete("/delete", protectedRoute, deleteNotification)

export default router