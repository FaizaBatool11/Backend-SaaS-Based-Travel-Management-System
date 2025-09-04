import express from "express";
import { createAgency, getAllAgencies, assignAgentToAgency } from "../controllers/createagencyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Only logged-in agency admin can create an agency
router.post("/", authMiddleware, createAgency);
router.get("/", getAllAgencies);
router.post("/assignAgent", authMiddleware, assignAgentToAgency);

export default router;
