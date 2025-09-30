// routes/roleRoutes.js
import express from "express";
import { createRole, getAllRoles, updateRole, deleteRole } from "../controllers/roleController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

// ✅ Owner hi new roles bana sake
router.post("/", authMiddleware, checkPermission("roles:create"), createRole);

// ✅ Roles list sab dekh sakte (e.g. dropdown ke liye)
router.get("/", authMiddleware, checkPermission("roles:view"), getAllRoles);
router.put("/:id",authMiddleware, checkPermission("roles:update"), updateRole);    // ✅ update
router.delete("/:id",authMiddleware, checkPermission("roles:delete"), deleteRole); // ✅ delete

export default router;
