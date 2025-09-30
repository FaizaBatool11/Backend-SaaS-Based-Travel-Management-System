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

// ✅ Sirf woh user access kare jiske paas "dashboard:view" permission ho
router.get(
  "/stats/:agencyId",
  authMiddleware,
  checkPermission("stats:view"),
  getDashboardStats
);

export default router;
