import express from "express";
import { createBooking, getAllBookings, cancelBooking, updateBooking } from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createBooking", authMiddleware, createBooking);       // Add
router.get("/getAllBookings", authMiddleware, getAllBookings);          // Get All
router.patch("/cancelBooking/:id/cancel", authMiddleware, cancelBooking); // Cancel
router.patch("/updateBooking/:id", authMiddleware, updateBooking);

export default router;
