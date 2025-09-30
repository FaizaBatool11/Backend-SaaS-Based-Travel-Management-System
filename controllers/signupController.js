// import bcrypt from "bcrypt";
// import db from "../models/index.js";

// const { User, Agency } = db;

// export const signup = async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     // check duplicate email
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // create user with default role = "owner"
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "owner", // ✅ hardcoded
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: newUser.id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//       },
//     });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

import bcrypt from "bcrypt";
import db from "../models/index.js";

const { User, Role, UserAgency } = db;

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check duplicate email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Fetch owner role
    const ownerRole = await Role.findOne({ where: { name: "owner" } });
    if (!ownerRole) {
      return res.status(500).json({ message: "Owner role not found in database" });
    }

    // NOTE: Linking to agency will happen after agency creation
    // We can return owner info now
    res.status(201).json({
      message: "Owner registered successfully. Please create your agency next.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: ownerRole.name, // just for frontend reference
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
