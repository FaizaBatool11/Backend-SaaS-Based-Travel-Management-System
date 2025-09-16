// routes/dashboardRoutes.js
import express from "express";
import { getDashboardStats } from "../controllers/statsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/stats/:agencyId", authMiddleware, getDashboardStats);
export default router;
