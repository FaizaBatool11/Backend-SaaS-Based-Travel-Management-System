
import express from "express";
import { loginUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ token verify karne ka middleware

const router = express.Router();

// ✅ Protected route
router.get("/loginUser", authMiddleware, loginUser);

export default router;
