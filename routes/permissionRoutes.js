import express from "express";
import { getPermissions, createPermission } from "../controllers/permissionController.js";

const router = express.Router();

// ✅ Routes
router.get("/", getPermissions);
router.post("/", createPermission);

export default router;
