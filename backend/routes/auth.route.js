import express from "express";
import { userLogin, userSignUp, userLogout, getMe } from "../controllers/auth.controller.js";
import protectedRoute from "../middlewares/protectedRoute.middleware.js";
const router = express.Router()

router.post("/signup" , userSignUp);

router.post("/login" , userLogin);

router.get("/logout" , userLogout);

router.get("/me", protectedRoute, getMe);

export default router