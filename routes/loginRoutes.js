import express from "express";
import { login, switchAgency } from "../controllers/loginController.js";
import { getCurrentUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { authenticate } from "../middleware/authenticate.js";
const router = express.Router();

router.post("/Login", login);
router.get("/currentUser", authenticate, getCurrentUser);
router.post("/switchAgency", authMiddleware, switchAgency);

export default router;
