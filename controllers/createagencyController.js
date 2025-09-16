import db from "../models/index.js";

const { Agency, User } = db;

export const createAgency = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // ✅ Logged-in user (from middleware JWT verify)
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - No user in token" });
    }

    const user = await User.findByPk(userId, {
      include: [{ model: Agency, as: "agencies" }]
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Only agency_admin can create an agency
    if (user.role !== "owner") {
      return res.status(403).json({ message: "Only owner can create agencies" });
    }

    // ✅ Check if this admin already has an agency via pivot table
    // const existingAgencies = user.agencies;
    // if (existingAgencies.length > 0) {
    //   return res.status(400).json({ message: "You have already created an agency" });
    // }

    // ✅ Check if another agency already exists with this email
    // const existingAgency = await Agency.findOne({ where: { email } });
    // if (existingAgency) {
    //   return res.status(400).json({ message: "Agency already exists with this email" });
    // }

    // ✅ Create agency
    const newAgency = await Agency.create({
      name,
      email,
      phone,
      address,
    });

    // ✅ Link the admin user via pivot table as "owner"
    await newAgency.addUsers(user, { through: { role: "owner" } });

    return res.status(201).json({
      message: "Agency created successfully",
      agency: {
        id: newAgency.id,
        name: newAgency.name,
        email: newAgency.email,
        phone: newAgency.phone,
        address: newAgency.address,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Error creating agency:", error);
    if (error.errors) {
      error.errors.forEach(e => console.error(e.message));
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ API to link booking agent with an agency
// export const assignAgentToAgency = async (req, res) => {
//   try {
//     const { userId, agencyId } = req.body;

//     // user check
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     if (user.role !== "booking_agent") {
//       return res.status(400).json({ message: "Only booking agents can be assigned to an agency" });
//     }

//     // agency check
//     const agency = await Agency.findByPk(agencyId);
//     if (!agency) {
//       return res.status(404).json({ message: "Agency not found" });
//     }

//     // pivot table entry
//     await agency.addUsers(user, { through: { role: "booking_agent" } });

//     return res.status(200).json({
//       message: "Booking agent linked with agency successfully",
//       user: { id: user.id, name: user.name, email: user.email },
//       agency: { id: agency.id, name: agency.name },
//     });

//   } catch (error) {
//     console.error("Error assigning agent to agency:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getAllAgencies = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Agency,
          as: "agencies",
          attributes: ["id", "name"],
          through: { attributes: [] } // pivot table ka data skip karna
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.agencies); // 👈 sirf is user ki agencies bhejo
  } catch (error) {
    console.error("Error fetching agencies:", error);
    res.status(500).json({ message: "Error fetching agencies" });
  }
};