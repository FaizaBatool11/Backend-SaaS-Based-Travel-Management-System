import express from "express";
import { signup } from "../controllers/signupController.js";

const router = express.Router();

router.post("/Signup", signup);

export default router;
