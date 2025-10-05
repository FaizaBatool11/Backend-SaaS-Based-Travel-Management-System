// routes/dashboardRoutes.js
import express from "express";
import { getSeatUtilization } from "../controllers/seatutilizationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.get("/:agencyId",authMiddleware,checkPermission("seat_utilization:view"), getSeatUtilization);

export default router;
