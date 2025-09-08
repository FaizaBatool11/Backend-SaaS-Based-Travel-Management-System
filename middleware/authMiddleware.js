// import jwt from "jsonwebtoken";

// export const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

//   if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

//   try {
//     const secret = process.env.JWT_SECRET || "secretkey";
//     const decoded = jwt.verify(token, secret);
//     req.user = decoded; // attach user info to request
//     next();
//   } catch (err) {
//     console.error("JWT verification error:", err);
//   res.status(403).json({ message: "Invalid or expired token." });
//   }
// };


// import jwt from "jsonwebtoken";

// export const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

//   if (!token) {
//     return res.status(401).json({ message: "Access denied. No token provided." });
//   }

//   try {
//     const secret = process.env.JWT_SECRET || "secretkey";
//     const decoded = jwt.verify(token, secret);

//     // ✅ attach user info to request
//     req.user = {
//       id: decoded.id,          // user id
//       role: decoded.role,      // super_admin / agency_admin / normal_user
//       agencyId: decoded.agencyId || null // (agar token me ho)
//     };

//     if (!req.user.agencyId && req.user.role === "booking_agent") {
//       const ua = await UserAgency.findOne({ where: { userId: req.user.id } });
//       if (ua) {
//         req.user.agencyId = ua.agencyId;
//       }
//     }


//     next();
//   } catch (err) {
//     console.error("JWT verification error:", err);
//     return res.status(403).json({ message: "Invalid or expired token." });
//   }
// };

import jwt from "jsonwebtoken";
import db from "../models/index.js"; // import your models
const { UserAgency } = db;

export const authMiddleware = async (req, res, next) => {
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
      agencyId: decoded.agencyId || null, // if available in token
    };

    // fetch agencyId from DB if missing and user is booking_agent
    if (!req.user.agencyId && req.user.role === "booking_agent") {
      const ua = await UserAgency.findOne({ where: { userId: req.user.id } });
      if (ua) req.user.agencyId = ua.agencyId;
    }

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};