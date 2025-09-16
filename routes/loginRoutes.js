import express from "express";
import { login, switchAgency } from "../controllers/loginController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/Login", login);
router.post("/switchAgency", authMiddleware, switchAgency);

export default router;
