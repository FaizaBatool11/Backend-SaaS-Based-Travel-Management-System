import express from "express";
import {getAllPassengers,getPassengerById,createPassenger,updatePassenger,deletePassenger} from "../controllers/passengerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

// Routes
router.post("/addPassenger", authMiddleware, createPassenger);
router.get("/getAllPassengers", authMiddleware, getAllPassengers);
router.get("/getPassengerById/:id", authMiddleware, getPassengerById);
router.put("/updatePassenger/:id", authMiddleware, updatePassenger);
router.delete("/deletePassenger/:id", authMiddleware, deletePassenger);

export default router;