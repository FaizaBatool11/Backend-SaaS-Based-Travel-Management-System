import express from "express";
import {
  assignUserToAgency,
  getUserAgencies,
  removeUserFromAgency,
} from "../controllers/useragencyController.js";

const router = express.Router();

// POST: Assign user → agency
router.post("/assign", assignUserToAgency);

// GET: Get all agencies of a user
router.get("/user/:userId", getUserAgencies);

// DELETE: Remove user from agency
router.delete("/remove", removeUserFromAgency);

export default router;
