// import db from "../models/index.js";
// const { UserAgency, Role, Permission } = db;

// export const checkPermission = (requiredPermission) => {
//   return async (req, res, next) => {
//     try {
//       const userId = req.user.id;
//       const agencyId = req.user.agencyId;
//       // Skip agency check for create agency route
//       if (req.path === "/api/agencies" && req.method === "POST") {
//         return next();
//       }

//       const userAgency = await UserAgency.findOne({
//         where: { userId, agencyId },
//         include: [
//           {
//             model: Role,
//             as: "role",  // alias = role
//             include: [{ model: Permission, as: "permissions" }],
//           },
//         ],
//       });

//       if (!userAgency || !userAgency.role) {
//         return res
//           .status(403)
//           .json({ message: "No role assigned for this user in this agency" });
//       }

//       // ✅ use lowercase "role"
//       const permissions = userAgency.role.permissions.map((p) => p.name);

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

export const checkPermission = (requiredPermissions) => {
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
            as: "role",
            include: [{ model: Permission, as: "permissions" }],
          },
        ],
      });

      if (!userAgency || !userAgency.role) {
        return res
          .status(403)
          .json({ message: "No role assigned for this user in this agency" });
      }

      const permissions = userAgency.role.permissions.map((p) => p.name);

      // ✅ Ensure requiredPermissions is always an array
      const required = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      // ✅ Check if user has ANY of the required permissions
      const hasPermission = required.some((perm) => permissions.includes(perm));

      if (!hasPermission) {
        return res.status(403).json({ message: "Permission denied" });
      }

      next();
    } catch (err) {
      console.error("Permission check error:", err);
      res.status(500).json({ message: "Server error in permission check" });
    }
  };
};
