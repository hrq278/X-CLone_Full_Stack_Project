import express from "express";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
import { getUserProfile, followUnfollowUser, getSuggestedUsers, updateUserProfile } from "../controllers/user.controller.js";

const router = express.Router()

router.get("/profile/:username",protectedRoute, getUserProfile)
router.post("/follow/:id",protectedRoute, followUnfollowUser)
router.get("/suggested",protectedRoute, getSuggestedUsers)
router.post("/update",protectedRoute, updateUserProfile)


export default router