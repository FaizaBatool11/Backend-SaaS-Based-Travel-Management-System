import bcrypt from "bcrypt";
import db from "../models/index.js";

const { User, Agency } = db;

export const signup = async (req, res) => {
  const { name, email, password } = req.body; // ❌ role aur agencyId frontend se nahi lena

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // check duplicate email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create user with default role = "owner"
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "owner", // ✅ hardcoded
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
