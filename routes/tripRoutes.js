// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import { createTrip, getAllTrips, getTripById, updateTrip, deleteTrip } from "../controllers/tripController.js";

// const router = express.Router();

// router.post("/addTrip", authMiddleware, createTrip);
// router.get("/getAllTrips", authMiddleware, getAllTrips);
// router.get("/getTripById/:id", authMiddleware, getTripById);
// router.put("/updateTrip/:id", authMiddleware, updateTrip);
// router.delete("/deleteTrip/:id", authMiddleware, deleteTrip);
// // router.get("/bookingAgentTrips", authMiddleware, getTripsForBookingAgent);

// export default router;

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createTrip, getAllTrips, getTripById, updateTrip, deleteTrip } from "../controllers/tripController.js";
import { checkPermission } from "../middleware/checkPermission.js";

const router = express.Router();

// 🔒 Only users with trips:create can add trips
router.post("/addTrip", authMiddleware, checkPermission("trips:create"), createTrip);

// 🔒 Anyone with trips:read can see trips
router.get("/getAllTrips", authMiddleware, checkPermission("trips:read"), getAllTrips);
router.get("/getTripById/:id", authMiddleware, checkPermission("trips:read"), getTripById);

// 🔒 Only users with trips:update can update
router.put("/updateTrip/:id", authMiddleware, checkPermission("trips:update"), updateTrip);

// 🔒 Only users with trips:delete can delete
router.delete("/deleteTrip/:id", authMiddleware, checkPermission("trips:delete"), deleteTrip);

export default router;
