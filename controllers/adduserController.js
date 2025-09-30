// controllers/userController.js
import db from "../models/index.js";
import bcrypt from "bcryptjs";

const { User, Agency, UserAgency, Role } = db;

// ✅ Add User (Owner Only)
// export const addUser = async (req, res) => {
//   try {
//     const { name, email, password, roleId } = req.body;
//     const { agencyId } = req.params;

//     // 1️⃣ Validate fields
//     if (!name || !email || !password || !roleId || !agencyId) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // 2️⃣ Check if role exists
//     const role = await Role.findByPk(roleId);
//     if (!role || role.name === "owner") {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     // 3️⃣ Only owner can add users
//     if (!req.user || req.user.role !== "owner") {
//       return res
//         .status(403)
//         .json({ message: "Only agency owner can add users" });
//     }

//     // 4️⃣ Verify owner belongs to this agency
//     const ownerAgency = await Agency.findByPk(agencyId, {
//       include: [
//         {
//           model: User,
//           as: "users",
//           where: { id: req.user.id },
//           through: { attributes: [] },
//         },
//       ],
//     });

//     if (!ownerAgency) {
//       return res
//         .status(403)
//         .json({ message: "You are not the owner of this agency" });
//     }

//     // 5️⃣ Check email uniqueness
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // 6️⃣ Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 7️⃣ Create user (without agencyId, join table handles it)
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: role.name,
//     });

//     // 8️⃣ Link user with agency in UserAgency
//     await UserAgency.create({
//       userId: newUser.id,
//       agencyId,
//       roleId: role.id,
//     });

//     return res.status(201).json({
//       message: "User created successfully",
//       user: {
//         id: newUser.id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//       },
//     });
//   } catch (err) {
//     console.error("AddUser error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

export const addUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;
    const { agencyId } = req.params;

    if (!name || !email || !password || !roleId || !agencyId)
      return res.status(400).json({ message: "All fields are required" });

    // Check role exists
    const role = await Role.findByPk(roleId);
    if (!role) return res.status(400).json({ message: "Invalid role" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Link user with agency + role in join table
    await UserAgency.create({
      userId: newUser.id,
      agencyId,
      roleId: role.id,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: role.name, // just for frontend display
      },
    });
  } catch (err) {
    console.error("AddUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUsers = async (req, res) => {
  try {
    const { agencyId } = req.params;

    // ✅ Fetch users for this agency including their role
    const users = await User.findAll({
      include: [
        {
          model: UserAgency,
          where: { agencyId },
          include: [{ model: Role, as: "role", attributes: ["name"] }],
        },
      ],
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found for this agency" });
    }

    // ✅ Format users and exclude owner
    const formattedUsers = users
      .filter(u => u.UserAgencies[0].role.name !== "owner")
      .map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.UserAgencies[0].role.name,
      }));

    return res.status(200).json(formattedUsers);
  } catch (err) {
    console.error("GetUsers error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ✅ Delete User
// export const deleteUser = async (req, res) => {
//   try {
//     const { id, agencyId } = req.params;

//     // Only owner can delete
//     if (!req.user || req.user.role !== "owner") {
//       return res
//         .status(403)
//         .json({ message: "Only agency owner can delete users" });
//     }

//     // Check user exists
//     const user = await User.findByPk(id);
//     if (!user || user.role === "owner") {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Remove from UserAgency
//     await UserAgency.destroy({ where: { userId: id, agencyId } });

//     // Delete user
//     await user.destroy();

//     return res.status(200).json({ message: "User deleted successfully" });
//   } catch (err) {
//     console.error("DeleteUser error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
