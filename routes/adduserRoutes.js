// import express from "express";
// import { addUser, getUsers } from "../controllers/adduserController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Pass agencyId in URL
// router.get("/:agencyId", authMiddleware, getUsers);
// router.post("/:agencyId",authMiddleware, addUser);

// export default router;

import express from "express";
import { addUser, getUsers } from "../controllers/adduserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

// ✅ Get Users (sirf wo users jinke pass "users:view" permission ho)
router.get(
  "/:agencyId",
  authMiddleware,
  checkPermission("users:read"),
  getUsers
);

// ✅ Add User (sirf wo jinke pass "users:create" permission ho)
router.post(
  "/:agencyId",
  authMiddleware,
  checkPermission("users:create"),
  addUser
);

export default router;
