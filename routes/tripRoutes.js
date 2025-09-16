import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createTrip, getAllTrips, getTripById, updateTrip, deleteTrip } from "../controllers/tripController.js";

const router = express.Router();

router.post("/addTrip", authMiddleware, createTrip);
router.get("/getAllTrips", authMiddleware, getAllTrips);
router.get("/getTripById/:id", authMiddleware, getTripById);
router.put("/updateTrip/:id", authMiddleware, updateTrip);
router.delete("/deleteTrip/:id", authMiddleware, deleteTrip);
// router.get("/bookingAgentTrips", authMiddleware, getTripsForBookingAgent);

export default router;
