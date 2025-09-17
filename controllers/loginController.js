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

    // if (user.role !== "owner") {
    //   return res.status(403).json({ message: "Only owners can login here" });
    // }

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
        // agencyId: user.agencies.length > 0 ? user.agencies[0].id : null, // 👈 add this
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Decide dashboard for owner
    // let dashboard = "";
    // if (user.agencies.length > 0) {
    //   dashboard = `/Admin/${user.agencies[0].id}`; // first agency
    // } else {
    //   dashboard = "/Admin/AddAgencyPage"; // first-time owner
    // }
    let dashboard = "";

if (user.role === "owner") {
  // Owners → Admin dashboard
  dashboard =
    user.agencies.length > 0
      ? `/Admin/${user.agencies[0].id}`
      : "/Admin/AddAgencyPage";
} else if (user.role === "manager") {
  dashboard = "/Admin";
} else if (user.role === "booking-agent") {
  dashboard = "/Admin";
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


export const switchAgency = async (req, res) => {
  const { agencyId } = req.body;

  // Check ke user is agency ka owner hai ya nahi
  const userAgency = await db.UserAgency.findOne({
    where: { userId: req.user.id, agencyId },
  });

  if (!userAgency) {
    return res.status(403).json({ message: "You don't belong to this agency" });
  }

  // ✅ Naya token jisme agencyId bhi inject ho
  const token = jwt.sign(
    {
      id: req.user.id,
      role: req.user.role,
      agencyId, // 👈 ab ye har request ke sath jayega
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};
