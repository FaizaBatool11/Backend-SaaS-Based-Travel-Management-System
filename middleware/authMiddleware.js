
import jwt from "jsonwebtoken";
import db from "../models/index.js"; // import your models
const { UserAgency } = db;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const secret = process.env.JWT_SECRET || "secretkey";
    const decoded = jwt.verify(token, secret);

    // attach basic user info
    req.user = {
      id: decoded.id,
      role: decoded.role,
      agencyId: decoded.agencyId, // 👈 ye hona chahiye
    };

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

export default authMiddleware;