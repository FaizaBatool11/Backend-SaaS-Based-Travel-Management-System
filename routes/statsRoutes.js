// // routes/dashboardRoutes.js
// import express from "express";
// import { getDashboardStats } from "../controllers/statsController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();
// router.get("/stats/:agencyId", authMiddleware, getDashboardStats);
// export default router;

// routes/dashboardRoutes.js
import express from "express";
import { getDashboardStats } from "../controllers/statsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

router.get(
  "/stats/:agencyId",
  authMiddleware,
  checkPermission([
  "stats:all:view",
  "stats:bookings:view",
  "stats:trips:view",
  "stats:passengers:view",
]),
  getDashboardStats
);

export default router;
