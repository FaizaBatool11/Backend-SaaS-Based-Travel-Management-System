// import express from "express";
// import { createBooking, getAllBookings, cancelBooking, updateBooking } from "../controllers/bookingController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/createBooking", authMiddleware, createBooking);       // Add
// router.get("/getAllBookings", authMiddleware, getAllBookings);          // Get All
// router.patch("/cancelBooking/:id/cancel", authMiddleware, cancelBooking); // Cancel
// router.patch("/updateBooking/:id", authMiddleware, updateBooking);

// export default router;

import express from "express";
import {
  createBooking,
  getAllBookings,
  cancelBooking,
  updateBooking,
} from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

// ✅ Booking create karne ke liye
router.post(
  "/createBooking",
  authMiddleware,
  checkPermission("bookings:create"),
  createBooking
);

// ✅ Sabhi bookings dekhne ke liye
router.get(
  "/getAllBookings",
  authMiddleware,
  checkPermission("bookings:read"),
  getAllBookings
);

// ✅ Booking cancel karne ke liye
router.patch(
  "/cancelBooking/:id/cancel",
  authMiddleware,
  checkPermission("bookings:cancel"),
  cancelBooking
);

// ✅ Booking update karne ke liye
router.patch(
  "/updateBooking/:id",
  authMiddleware,
  checkPermission("bookings:update"),
  updateBooking
);

export default router;
