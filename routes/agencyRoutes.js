// import express from "express";
// import { createAgency, getAllAgencies} from "../controllers/createagencyController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// // ✅ Only logged-in agency admin can create an agency
// router.post("/", authMiddleware, createAgency);
// router.get("/", authMiddleware, getAllAgencies);
// // router.post("/assignAgent", authMiddleware, assignAgentToAgency);

// export default router;

import express from "express";
import { createAgency, getAllAgencies } from "../controllers/createagencyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

// ✅ Sirf wo users jinke pass "agencies:create" permission ho
router.post(
  "/",
  authMiddleware,
  // checkPermission("agencies:create"),
  createAgency
);

// ✅ Sirf wo users jinke pass "agencies:view" permission ho
router.get(
  "/",
  authMiddleware,
  checkPermission("agencies:view"),
  getAllAgencies
);

export default router;
