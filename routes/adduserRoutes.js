// import express from "express";
// import { adduser } from "../controllers/adduserController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// // POST /api/users -> Add a new user
// router.post("/",authMiddleware, adduser);

// export default router;
// routes/userRoutes.js
import express from "express";
import { addUser, getUsers } from "../controllers/adduserController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Pass agencyId in URL
router.get("/:agencyId", authMiddleware, getUsers);
router.post("/:agencyId",authMiddleware, addUser);

export default router;
