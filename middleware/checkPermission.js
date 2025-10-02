// // middlewares/checkPermission.js
// import db from "../models/index.js";

// const { UserAgency, Role, Permission, User } = db;

// export const checkPermission = (requiredPermission) => {
//   return async (req, res, next) => {
//     try {
//       const userId = req.user.id; // JWT se aya user
//       const agencyId = req.headers["x-agency-id"];

//       if (!agencyId) {
//         return res.status(400).json({ message: "Agency ID required" });
//       }

//       // UserAgency with Role + Permissions
//       const userAgency = await UserAgency.findOne({
//         where: { userId, agencyId },
//         include: [
//           {
//             model: Role,
//             include: [{ model: Permission, as: "permissions" }],
//           },
//         ],
//       });

//       if (!userAgency || !userAgency.Role) {
//         return res
//           .status(403)
//           .json({ message: "No role assigned for this user in this agency" });
//       }

//       // Permissions list
//       const permissions = userAgency.Role.permissions.map((p) => p.name);

//       // Check required permission
//       if (!permissions.includes(requiredPermission)) {
//         return res.status(403).json({ message: "Permission denied" });
//       }

//       // ✅ Access granted
//       next();
//     } catch (err) {
//       console.error("Permission check error:", err);
//       res.status(500).json({ message: "Server error in permission check" });
//     }
//   };
// };

// import db from "../models/index.js";
// const { UserAgency, Role, Permission } = db;
// export const checkPermission = (requiredPermission) => {
//   return async (req, res, next) => {
//     try {
//       const userId = req.user.id;

//       // Skip agency check for create agency route
//       if (req.path === "/api/agencies" && req.method === "POST") {
//         return next(); // let createAgency run without agencyId
//       }

//       const userAgency = await UserAgency.findOne({
//         where: { userId },
//         include: [
//           {
//             model: Role,
//             as: "role",
//             include: [{ model: Permission, as: "permissions" }],
//           },
//         ],
//       });

//       if (!userAgency || !userAgency.role) {
//         return res
//           .status(403)
//           .json({ message: "No role assigned for this user in this agency" });
//       }

//       const permissions = userAgency.Role.permissions.map((p) => p.name);
//       if (!permissions.includes(requiredPermission)) {
//         return res.status(403).json({ message: "Permission denied" });
//       }

//       next();
//     } catch (err) {
//       console.error("Permission check error:", err);
//       res.status(500).json({ message: "Server error in permission check" });
//     }
//   };
// };

import db from "../models/index.js";
const { UserAgency, Role, Permission } = db;

export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const agencyId = req.user.agencyId;
      // Skip agency check for create agency route
      if (req.path === "/api/agencies" && req.method === "POST") {
        return next();
      }

      const userAgency = await UserAgency.findOne({
        where: { userId, agencyId },
        include: [
          {
            model: Role,
            as: "role",  // alias = role
            include: [{ model: Permission, as: "permissions" }],
          },
        ],
      });

      if (!userAgency || !userAgency.role) {
        return res
          .status(403)
          .json({ message: "No role assigned for this user in this agency" });
      }

      // ✅ use lowercase "role"
      const permissions = userAgency.role.permissions.map((p) => p.name);

      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Permission denied" });
      }

      next();
    } catch (err) {
      console.error("Permission check error:", err);
      res.status(500).json({ message: "Server error in permission check" });
    }
  };
};
