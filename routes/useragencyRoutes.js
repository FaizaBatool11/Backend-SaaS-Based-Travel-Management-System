// import express from "express";
// import {
//   assignUserToAgency,
//   getUserAgencies,
//   removeUserFromAgency,
// } from "../controllers/useragencyController.js";

// const router = express.Router();

// // POST: Assign user → agency
// router.post("/assign", assignUserToAgency);

// // GET: Get all agencies of a user
// router.get("/user/:userId", getUserAgencies);

// // DELETE: Remove user from agency
// router.delete("/remove", removeUserFromAgency);

// export default router;

import express from "express";
import {
  assignUserToAgency,
  getUserAgencies
} from "../controllers/useragencyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

// 🔒 Only Owner can assign user to agency
router.post("/", authMiddleware, checkPermission("users:update"), assignUserToAgency);

// 🔒 Any logged-in user can view their agencies
router.get("/:userId", authMiddleware, checkPermission("users:read"), getUserAgencies);

export default router;
