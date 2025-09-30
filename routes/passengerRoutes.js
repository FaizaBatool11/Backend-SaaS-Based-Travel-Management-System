// import express from "express";
// import {
//   getAllPassengers,
//   getPassengerById,
//   createPassenger,
//   updatePassenger,
//   deletePassenger,
// } from "../controllers/passengerController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// // ✅ AgencyId ab token se liya jayega (req.user.agencyId)
// router.get("/getAllPassengers", authMiddleware, getAllPassengers);
// router.post("/addPassenger", authMiddleware, createPassenger);
// router.get("/getPassengerById/:id", authMiddleware, getPassengerById);
// router.put("/updatePassenger/:id", authMiddleware, updatePassenger);
// router.delete("/deletePassenger/:id", authMiddleware, deletePassenger);

// export default router;

import express from "express";
import {
  getAllPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
} from "../controllers/passengerController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

// ✅ Sabhi passengers dekhne ke liye
router.get(
  "/getAllPassengers",
  authMiddleware,
  checkPermission("passengers:read"),
  getAllPassengers
);

// ✅ Passenger add karne ke liye
router.post(
  "/addPassenger",
  authMiddleware,
  checkPermission("passengers:create"),
  createPassenger
);

// ✅ Single passenger detail dekhne ke liye
router.get(
  "/getPassengerById/:id",
  authMiddleware,
  checkPermission("passengers:read"),
  getPassengerById
);

// ✅ Passenger update karne ke liye
router.put(
  "/updatePassenger/:id",
  authMiddleware,
  checkPermission("passengers:update"),
  updatePassenger
);

// ✅ Passenger delete karne ke liye
router.delete(
  "/deletePassenger/:id",
  authMiddleware,
  checkPermission("passengers:delete"),
  deletePassenger
);

export default router;
