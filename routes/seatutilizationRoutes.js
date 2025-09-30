// routes/dashboardRoutes.js
import express from "express";
import { getSeatUtilization } from "../controllers/seatutilizationController.js";

const router = express.Router();

router.get("/:agencyId", getSeatUtilization);

export default router;
