// import db from "../models/index.js";

// const { Agency, User, Role, UserRoles, RolePermissions, Permission } = db;

// export const createAgency = async (req, res) => {
//   try {
//     const { name, email, phone, address } = req.body;

//     // ✅ Logged-in user (from middleware JWT verify)
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized - No user in token" });
//     }

//     const user = await User.findByPk(userId, {
//       include: [
//         {
//           model: Role,
//           as: "roles",
//           through: { attributes: [] }, // pivot table UserRoles
//         },
//       ],
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // ✅ Check if user has 'owner' role
//     const isOwner = user.roles.some((r) => r.name === "owner");
//     if (!isOwner) {
//       return res.status(403).json({ message: "Only owner can create agencies" });
//     }

//     // ✅ Create agency
//     const newAgency = await Agency.create({
//       name,
//       email,
//       phone,
//       address,
//     });

//     // ✅ Link the admin user via pivot table as "owner" in this agency
//     await newAgency.addUsers(user, { through: { role: "owner" } });

//     // ✅ Return full info for frontend
//     return res.status(201).json({
//       message: "Agency created successfully",
//       agencyId: newAgency.id, // frontend needs this
//       agency: {
//         id: newAgency.id,
//         name: newAgency.name,
//         email: newAgency.email,
//         phone: newAgency.phone,
//         address: newAgency.address,
//       },
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         roles: user.roles.map((r) => r.name), // dynamic roles
//       },
//     });
//   } catch (error) {
//     console.error("Error creating agency:", error);
//     if (error.errors) {
//       error.errors.forEach((e) => console.error(e.message));
//     }
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const getAllAgencies = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const user = await User.findByPk(userId, {
//       include: [
//         {
//           model: Agency,
//           as: "agencies",
//           attributes: ["id", "name", "email", "phone", "address"],
//           through: { attributes: ["role"] }, // role in that agency
//         },
//       ],
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Return agencies with user role in each agency
//     const agencies = user.agencies.map((agency) => ({
//       id: agency.id,
//       name: agency.name,
//       email: agency.email,
//       phone: agency.phone,
//       address: agency.address,
//       userRole: agency.UserAgencies.role, // role in this agency
//     }));

//     res.json(agencies);
//   } catch (error) {
//     console.error("Error fetching agencies:", error);
//     res.status(500).json({ message: "Error fetching agencies" });
//   }
// };

import db from "../models/index.js";

const { Agency, User, Role, UserAgency } = db;

// Create a new agency
export const createAgency = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const userId = req.user?.id; // from JWT
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Fetch user
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if user is "owner" (only owner can create agency)
    const ownerRole = await Role.findOne({ where: { name: "owner" } });
    if (!ownerRole) return res.status(500).json({ message: "Owner role not found" });

    // Optional: Check if user already linked as owner to any agency
    const existingLink = await UserAgency.findOne({
      where: { userId, roleId: ownerRole.id },
    });

    // Create agency
    const newAgency = await Agency.create({ name, phone, address });

    // Link owner to agency via UserAgency
    await UserAgency.create({
      userId: user.id,
      agencyId: newAgency.id,
      roleId: ownerRole.id,
    });

    res.status(201).json({
      message: "Agency created successfully",
      agency: {
        id: newAgency.id,
        name: newAgency.name,
        phone: newAgency.phone,
        address: newAgency.address,
      },
      user: {
        id: user.id,
        name: user.name,
        role: ownerRole.name,
      },
    });
  } catch (error) {
    console.error("Error creating agency:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all agencies for logged-in user
export const getAllAgencies = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Fetch UserAgency links
    const userAgencies = await UserAgency.findAll({
      where: { userId },
      include: [
        {
          model: Agency,
          as: "agency", // ✅ must match alias in model
          attributes: ["id", "name", "phone", "address"],
        },
        {
          model: Role, 
          as: "role",
          attributes: ["name"],
        },
      ],
    });

    const agencies = userAgencies.map((ua) => ({
      id: ua.agency.id,
      name: ua.agency.name,
      phone: ua.agency.phone,
      address: ua.agency.address,
      userRole: ua.role.name, // Role is accessible directly
    }));

    res.json(agencies);
  } catch (error) {
    console.error("Error fetching agencies:", error);
    res.status(500).json({ message: "Error fetching agencies" });
  }
};
