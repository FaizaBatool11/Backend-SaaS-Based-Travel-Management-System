// import bcrypt from "bcrypt";
// import db from "../models/index.js";
// const { User, Agency } = db;

// export const signup = async (req, res) => {
//   const { name, email, password, role, agencyId } = req.body;

//   // Validation
//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     // Check if email already exists
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       agencyId: agencyId || null,
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: newUser.id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//         agencyId: newUser.agencyId,
//       },
//     });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


// import bcrypt from "bcrypt";
// import db from "../models/index.js";

// const { User, Agency } = db;

// export const signup = async (req, res) => {
//   const { name, email, password, role, agencyId } = req.body;

//   // Validation
//   if (!name || !email || !password || !role) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     // Check if email already exists
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//     });

//     // Agar agencyId aya hai to pivot table me link karo
//     if (agencyId) {
//       const agency = await Agency.findByPk(agencyId);
//       if (!agency) {
//         return res.status(404).json({ message: "Agency not found" });
//       }
//       // Many-to-Many association helper
//       await newUser.addAgency(agency);
//     }

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: newUser.id,
//         name: newUser.name,
//         email: newUser.email,
//         role: newUser.role,
//         agencies: agencyId ? [agencyId] : [],
//       },
//     });
//   } catch (error) {
//     console.error("Signup error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

import bcrypt from "bcrypt";
import db from "../models/index.js";

const { User, Agency } = db;

export const signup = async (req, res) => {
  const { name, email, password, role, agencyId } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // check duplicate email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    let agencies = [];

    // 🔑 if role is booking_agent → agencyId required
    if (role === "booking_agent") {
      if (!agencyId) {
        return res.status(400).json({ message: "AgencyId is required for booking agents" });
      }

      const agency = await Agency.findByPk(agencyId);
      if (!agency) {
        return res.status(404).json({ message: "Agency not found" });
      }

      await newUser.addAgency(agency, { through: { role: "agent" } });
      agencies.push({ id: agency.id, name: agency.name });
    }

    // 🔑 if role is agency_admin → no agency link here
    // kyunki admin baad me apni agency create karega

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        agencies,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
