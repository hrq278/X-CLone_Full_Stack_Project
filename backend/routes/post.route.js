import express from "express"
import {
        commentPost,
        createPost,
        deletePost,
        likeUnlikePost,
        getAllPost,
        getLikedPost,
        getFollowingPosts,
        getUserPost
         } from "../controllers/post.controller.js";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";


const router = express.Router()


router.get("/allpost", protectedRoute, getAllPost)
router.get("/likedpost/:id", protectedRoute, getLikedPost)

router.get("/following", protectedRoute, getFollowingPosts)
router.get("/user/:username", protectedRoute, getUserPost)

router.post("/create", protectedRoute, createPost)
router.post("/likes/:id", protectedRoute, likeUnlikePost)
router.post("/comment/:id", protectedRoute, commentPost)

router.delete("/delete/:id", protectedRoute, deletePost)

export default router;