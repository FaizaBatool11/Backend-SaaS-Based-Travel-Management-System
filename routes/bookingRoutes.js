import express from "express";
import { createBooking, getBookings, cancelBooking } from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addBooking", authMiddleware, createBooking);
router.get("/getBooking", authMiddleware, getBookings);
router.put("/cancelBooking/:id/cancel", authMiddleware, cancelBooking);

export default router;
