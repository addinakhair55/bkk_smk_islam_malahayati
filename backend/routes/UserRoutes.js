import express from "express";
import { register, login, resetPasswordRequest, resetPassword, getUserProfile} from "../controllers/UserController.js";
import { protect } from "../middle/AuthMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", resetPasswordRequest);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", protect, getUserProfile);

export default router;