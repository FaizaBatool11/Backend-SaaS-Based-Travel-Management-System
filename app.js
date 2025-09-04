import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import signupRoutes from "./routes/signupRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import agencyRoutes from "./routes/agencyRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import passengerRoutes from "./routes/passengerRoutes.js";
import db from "./models/index.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
// app.use(cors());
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true
}));

app.use(express.json());

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Mysql connected successfully");
  } catch (err) {
    console.error("❌ Mysql connection failed:", err);
  }
})();

// app.use("/api/trips", tripRoutes);

app.use("/api/auth", signupRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/agencies", agencyRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/passengers", passengerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
