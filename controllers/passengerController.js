import db from "../models/index.js";
const { Passenger, Agency } = db;

// ✅ Get all passengers (agencyId from token)
// export const getAllPassengers = async (req, res) => {
//   try {
//     if (req.user.role !== "owner") {
//       return res.status(403).json({ message: "Only owners can view passengers" });
//     }

//     const agencyId = req.user.agencyId;

//     const passengers = await Passenger.findAll({
//       where: { agencyId },
//       include: [{ model: Agency, attributes: ["id", "name"] }],
//     });

//     res.status(200).json(passengers);
//   } catch (error) {
//     console.error("Error fetching passengers:", error);
//     res.status(500).json({ message: "Error fetching passengers", error: error.message });
//   }
// };
export const getAllPassengers = async (req, res) => {
  try {
    console.log("Decoded user in getAllPassengers:", req.user); // 👀 debug log
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owners can view passengers" });
    }

    const agencyId = req.user.agencyId; // 👈 JWT se milega

    const passengers = await Passenger.findAll({
      where: { agencyId },
      include: [{ model: Agency, attributes: ["id", "name"] }],
    });

    res.status(200).json(passengers);
  } catch (error) {
    console.error("Error fetching passengers:", error);
    res.status(500).json({ message: "Error fetching passengers", error: error.message });
  }
};


// ✅ Get passenger by ID
export const getPassengerById = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owners can view passengers" });
    }

    const { id } = req.params;
    const agencyId = req.user.agencyId;

    const passenger = await Passenger.findOne({
      where: { id, agencyId },
      include: [{ model: Agency, attributes: ["id", "name"] }],
    });

    if (!passenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    res.status(200).json(passenger);
  } catch (error) {
    console.error("Error fetching passenger:", error);
    res.status(500).json({ message: "Error fetching passenger", error: error.message });
  }
};

// ✅ Add passenger
export const createPassenger = async (req, res) => {
  try {
    const agencyId = req.user.agencyId;
    const { name, age, phone } = req.body;

    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owners can add passengers" });
    }

    if (!name || !age || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (isNaN(age) || age <= 0) {
      return res.status(400).json({ message: "Age must be a positive number" });
    }
    if (!/^\d{11}$/.test(phone)) {
      return res.status(400).json({ message: "Phone must be 11 digits" });
    }

    const passenger = await Passenger.create({
      name,
      age,
      phone,
      agencyId,
    });

    res.status(201).json(passenger);
  } catch (error) {
    console.error("Error creating passenger:", error);
    res.status(500).json({ message: "Error creating passenger", error: error.message });
  }
};

// ✅ Update passenger
export const updatePassenger = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owners can update passengers" });
    }

    const { id } = req.params;
    const agencyId = req.user.agencyId;
    const { name, age, phone } = req.body;

    const passenger = await Passenger.findOne({
      where: { id, agencyId },
    });

    if (!passenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    if (age && (isNaN(age) || age <= 0)) {
      return res.status(400).json({ message: "Age must be a positive number" });
    }
    if (phone && !/^\d{11}$/.test(phone)) {
      return res.status(400).json({ message: "Phone must be 11 digits" });
    }

    passenger.name = name ?? passenger.name;
    passenger.age = age ?? passenger.age;
    passenger.phone = phone ?? passenger.phone;

    await passenger.save();

    res.status(200).json(passenger);
  } catch (error) {
    console.error("Error updating passenger:", error);
    res.status(500).json({ message: "Error updating passenger", error: error.message });
  }
};

// ✅ Delete passenger
export const deletePassenger = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owners can delete passengers" });
    }

    const { id } = req.params;
    const agencyId = req.user.agencyId;

    const passenger = await Passenger.findOne({
      where: { id, agencyId },
    });

    if (!passenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    await passenger.destroy();

    res.status(200).json({ message: "Passenger deleted successfully" });
  } catch (error) {
    console.error("Error deleting passenger:", error);
    res.status(500).json({ message: "Error deleting passenger", error: error.message });
  }
};
