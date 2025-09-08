// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import db from "../models/index.js";

// const { User, Agency } = db;

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   console.log("Login request email:", email);

//   // 1. Validation
//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     // 2. Find user by email + include agencies
//     const user = await User.findOne({
//       where: { email },
//       include: [
//         {
//           model: Agency,
//           as: "agencies",
//           through: { attributes: [] }, // hide pivot table details
//         },
//       ],
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 3. Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     let dashboard = "";
//     if (user.role === "super_admin") dashboard = "/";
//     else if (user.role === "agency_admin") dashboard = "/Admin";
//     else if (user.role === "booking_agent") dashboard = "/Admin";

//     // 4. Generate JWT token
//     const token = jwt.sign(
//       {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         agencies: user.agencies.map((a) => ({
//           id: a.id,
//           name: a.name,
//         })),
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "5d" } // token expires in 1 hour
//     );

//     // 5. Successful login response with token
//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         dashboard,
//         agencies: user.agencies.map((a) => ({
//           id: a.id,
//           name: a.name,
//         })),
//       },
//       token, // send token to frontend
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { User, Agency } = db;

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
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "owner") {
      return res.status(403).json({ message: "Only owners can login here" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        agencies: user.agencies.map((a) => ({ id: a.id, name: a.name })),
      },
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    // Decide dashboard for owner
    let dashboard = "";
    if (user.agencies.length > 0) {
      dashboard = `/Admin/${user.agencies[0].id}`; // first agency
    } else {
      dashboard = "/AddAgencyPage"; // first-time owner
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        dashboard,
        agencies: user.agencies.map((a) => ({ id: a.id, name: a.name })),
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
