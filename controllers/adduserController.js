import db from "../models/index.js";
const { User, Agency, UserAgency } = db;
import bcrypt from "bcryptjs";

const ALLOWED_ROLES = ["manager", "booking-agent"];

export const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { agencyId } = req.params;

    // ✅ Validate fields
    if (!name || !email || !password || !role || !agencyId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Validate role
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // ✅ Only owner of this agency can add users
    if (!req.user || req.user.role !== "owner") {
      return res
        .status(403)
        .json({ message: "Only the owner of an agency can add users" });
    }

    // ✅ Check if owner really belongs to this agency
    const ownerAgency = await Agency.findByPk(agencyId, {
      include: [
        {
          model: User,
          as: "users",
          where: { id: req.user.id },
          through: { attributes: [] },
        },
      ],
    });

    if (!ownerAgency) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this agency" });
    }

    // ✅ Check email uniqueness
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user (without agencyId, because relation join table me hai)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // ✅ Link user with agency in join table
    const agency = await Agency.findByPk(agencyId);
    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    await agency.addUser(newUser);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("AddUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { agencyId } = req.params;

    const agency = await Agency.findByPk(agencyId, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "name", "email", "role", "createdAt"],
          through: { attributes: [] },
        },
      ],
    });

    if (!agency) {
      return res.status(404).json({ message: "Agency not found" });
    }

    return res.status(200).json({ users: agency.users.filter(u => u.role !== "owner") });
  } catch (err) {
    console.error("GetUsers error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
