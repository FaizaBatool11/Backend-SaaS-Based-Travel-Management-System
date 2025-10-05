// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import db from "../models/index.js";

// const { User, Agency, UserAgency, Role } = db;

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     // Find user by email and include agencies and roles via UserAgency
//   const user = await User.findOne({
//   where: { email },
//   include: [
//     {
//       model: Agency,
//       as: "agencies",
//       through: { attributes: ["roleId"] } // ✅ sirf yahan tak rakho
//     },
//   ],
// });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     // Decide default agency for dashboard
//     let dashboard = "";
//     let defaultAgency = null;
//     let userRole = null;

//     if (user.agencies.length > 0) {
//       defaultAgency = user.agencies[0];
//       // Fetch role name from UserAgency
//       const userAgency = await UserAgency.findOne({
//         where: { userId: user.id, agencyId: defaultAgency.id },
//         include: [{ model: Role, as: "roles" }],
//       });
//       userRole = userAgency.Role.name;

//       // Set dashboard based on role
//       if (userRole === "owner") {
//         dashboard = `/Admin/${defaultAgency.id}`;
//       } else {
//         dashboard = "/Admin";
//       }
//     } else {
//       // First-time owner (no agency yet)
//       dashboard = "/Admin/AddAgencyPage";
//       userRole = "owner";
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       {
//         id: user.id,
//         role: userAgency.roles.name,
//         agencyId: defaultAgency ? defaultAgency.id : null,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: userRole,
//         dashboard,
//         agencies: user.agencies.map((a) => ({ id: a.id, name: a.name })),
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const switchAgency = async (req, res) => {
//   try {
//     const { agencyId } = req.body;

//     if (!agencyId) return res.status(400).json({ message: "Agency ID required" });

//     // Check if user belongs to this agency
//     const userAgency = await UserAgency.findOne({
//       where: { userId: req.user.id, agencyId },
//       include: [{ model: Role, as: "roles" }],
//     });

//     if (!userAgency)
//       return res.status(403).json({ message: "You don't belong to this agency" });

//     // Generate new token with selected agency and role
//     const token = jwt.sign(
//       {
//         id: req.user.id,
//         agencyId,
//         role: userAgency.roles.name, // use alias
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ token, message: "Switched agency successfully" });
//   } catch (err) {
//     console.error("Switch agency error:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import db from "../models/index.js";

// const { User, Agency, UserAgency, Role } = db;

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     // Find user by email and include agencies via UserAgency
//     const user = await User.findOne({
//       where: { email },
//       include: [
//         {
//           model: Agency,
//           as: "agencies",
//           through: { attributes: ["roleId"] } // keep roleId in junction
//         },
//       ],
//     });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     // Decide default agency for dashboard
//     let dashboard = "";
//     let defaultAgency = null;
//     let userRole = null;

//     if (user.agencies.length > 0) {
//       defaultAgency = user.agencies[0];

//       // Fetch role name from UserAgency using correct alias
//       const userAgency = await UserAgency.findOne({
//         where: { userId: user.id, agencyId: defaultAgency.id },
//         include: [{ model: Role, as: "role" }], // ✅ use alias
//       });

//       if (!userAgency || !userAgency.role) {
//         return res.status(500).json({ message: "User role not found" });
//       }

//       userRole = userAgency.role.name; // ✅ correct alias

//       // Set dashboard based on role
//       // dashboard = userRole === "owner" ? `/Admin/${defaultAgency.id}` : "/Admin";
//     } else {
//       // First-time owner (no agency yet)
//       dashboard = "/Admin/AddAgencyPage";
//       userRole = "owner";
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       {
//         id: user.id,
//         role: userRole,
//         agencyId: defaultAgency ? defaultAgency.id : null,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: userRole,
//         agencies: user.agencies.map((a) => ({ id: a.id, name: a.name })),
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     // Find user by email and include agencies
//     const user = await User.findOne({
//       where: { email },
//       include: [
//         {
//           model: Agency,
//           as: "agencies",
//           through: { attributes: ["roleId"] }, // keep roleId in junction
//         },
//       ],
//     });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     let defaultAgency = null;
//     let userRole = null;
//     let permissions = [];

//     if (user.agencies.length > 0) {
//       defaultAgency = user.agencies[0];

//       // Fetch role + permissions from UserAgency
//       const userAgency = await UserAgency.findOne({
//         where: { userId: user.id, agencyId: defaultAgency.id },
//         include: [
//           {
//             model: Role,
//             as: "role",
//             include: [{ model: Permission, as: "permissions" }],
//           },
//         ],
//       });

//       if (!userAgency || !userAgency.role) {
//         return res.status(500).json({ message: "User role not found" });
//       }

//       userRole = userAgency.role.name;
//       permissions = userAgency.role.permissions.map((p) => p.name);
//     } else {
//       // First-time owner (no agency yet)
//       userRole = "owner";
//       defaultAgency = null;
//       permissions = []; // no permissions yet
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       {
//         id: user.id,
//         role: userRole,
//         agencyId: defaultAgency ? defaultAgency.id : null,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: userRole,
//         agencyId: defaultAgency ? defaultAgency.id : null,
//         agencies: user.agencies.map((a) => ({ id: a.id, name: a.name })),
//         permissions, // ✅ send permissions to frontend
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import db from "../models/index.js";

// const { User, Agency, UserAgency, Role, Permission } = db;

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     // Find user by email and include agencies
//     const user = await User.findOne({
//       where: { email },
//       include: [
//         {
//           model: Agency,
//           as: "agencies",
//           through: { attributes: ["roleId"] },
//         },
//       ],
//     });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     // Fetch owner role (needed for first-time login)
//     const ownerRole = await Role.findOne({ where: { name: "owner" }, include: [{ model: Permission, as: "permissions" }] });
//     if (!ownerRole) return res.status(500).json({ message: "Owner role not found in database" });

//     let defaultAgency = null;
//     let userRole = null;
//     let permissions = [];

//     if (user.agencies.length > 0) {
//       // Existing user with at least one agency
//       defaultAgency = user.agencies[0];

//       const userAgency = await UserAgency.findOne({
//         where: { userId: user.id, agencyId: defaultAgency.id },
//         include: [
//           {
//             model: Role,
//             as: "role",
//             include: [{ model: Permission, as: "permissions" }],
//           },
//         ],
//       });

//       if (!userAgency || !userAgency.role) {
//         return res.status(500).json({ message: "User role not found" });
//       }

//       userRole = userAgency.role.name;
//       permissions = userAgency.role.permissions.map((p) => p.name);

//     } else {
//       // First-time owner (no agency yet)
//       defaultAgency = await Agency.create({ name: `${user.name}'s Agency` });
//       const userAgency = await UserAgency.create({
//         userId: user.id,
//         agencyId: defaultAgency.id,
//         roleId: ownerRole.id,
//       });

//       userRole = ownerRole.name;
//       permissions = ownerRole.permissions.map((p) => p.name);

//       // Also add this agency to user's agencies array so frontend can read it
//       user.agencies.push(defaultAgency);
//     }

//     // Generate JWT token with role, agencyId, permissions
//     const token = jwt.sign(
//       {
//         id: user.id,
//         role: userRole,
//         agencyId: defaultAgency ? defaultAgency.id : null,
//         permissions,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     // Send response
//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: userRole,
//         agencyId: defaultAgency ? defaultAgency.id : null,
//         agencies: user.agencies.map((a) => ({ id: a.id, name: a.name })),
//         permissions,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { User, UserAgency, Role, Permission, Agency } = db;

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user by email and include agencies
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Agency,
          as: "agencies",
          through: { attributes: ["roleId"] },
        },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Fetch owner role (needed for first-time login)
    const ownerRole = await Role.findOne({
      where: { name: "owner" },
      include: [{ model: Permission, as: "permissions" }],
    });
    if (!ownerRole) return res.status(500).json({ message: "Owner role not found" });

    let defaultAgency = null;
    let userRole = null;
    let permissions = [];

    if (user.agencies.length > 0) {
      // Existing user with at least one agency
      defaultAgency = user.agencies[0];

      const userAgency = await UserAgency.findOne({
        where: { userId: user.id, agencyId: defaultAgency.id },
        include: [
          {
            model: Role,
            as: "role",
            include: [{ model: Permission, as: "permissions" }],
          },
        ],
      });

      if (!userAgency || !userAgency.role) {
        return res.status(500).json({ message: "User role not found" });
      }

      userRole = userAgency.role.name;
      permissions = userAgency.role.permissions.map((p) => p.name);
    } else {
      // First-time owner (no agency yet)
      // Do NOT create agency automatically
      userRole = ownerRole.name;
      permissions = ownerRole.permissions.map((p) => p.name);
      defaultAgency = null; // No agency yet
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        role: userRole,
        agencyId: defaultAgency ? defaultAgency.id : null,
        permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: userRole,
        agencyId: defaultAgency ? defaultAgency.id : null,
        agencies: user.agencies.map((a) => ({ id: a.id, name: a.name })),
        permissions,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const switchAgency = async (req, res) => {
  try {
    const { agencyId } = req.body;

    if (!agencyId) {
      return res.status(400).json({ message: "Agency ID required" });
    }

    // Check if user belongs to this agency
    const userAgency = await UserAgency.findOne({
      where: { userId: req.user.id, agencyId },
      include: [{ model: Role, as: "role" }], // ✅ correct alias
    });

    if (!userAgency || !userAgency.role) {
      return res.status(403).json({ message: "You don't belong to this agency" });
    }

    // Generate new token with selected agency and role
    const token = jwt.sign(
      {
        id: req.user.id,
        agencyId,
        role: userAgency.role.name, // ✅ correct alias
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      agencyId,
      role: userAgency.role.name,
      message: "Switched agency successfully",
    });
  } catch (err) {
    console.error("Switch agency error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

