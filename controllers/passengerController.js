import db from "../models/index.js";
const { Passenger, Agency } = db;

// ✅ Get all passengers (sirf apni agency ke passengers)
export const getAllPassengers = async (req, res) => {
  try {
    if (req.user.role !== "booking_agent") {
      return res
        .status(403)
        .json({ message: "Only booking agents can view passengers" });
    }

    const passengers = await Passenger.findAll({
      where: { agencyId: req.user.agencyId }, // ✅ sirf apni agency
      include: [{ model: Agency, attributes: ["id", "name"] }],
    });

    res.status(200).json(passengers);
  } catch (error) {
    console.error("Error fetching passengers:", error);
    res
      .status(500)
      .json({ message: "Error fetching passengers", error: error.message });
  }
};

// ✅ Get passenger by ID
export const getPassengerById = async (req, res) => {
  try {
    if (req.user.role !== "booking_agent") {
      return res
        .status(403)
        .json({ message: "Only booking agents can view passengers" });
    }

    const passenger = await Passenger.findOne({
      where: { id: req.params.id, agencyId: req.user.agencyId },
      include: [{ model: Agency, attributes: ["id", "name"] }],
    });

    if (!passenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    res.status(200).json(passenger);
  } catch (error) {
    console.error("Error fetching passenger:", error);
    res
      .status(500)
      .json({ message: "Error fetching passenger", error: error.message });
  }
};

// ✅ Add passenger
export const createPassenger = async (req, res) => {
  try {
    if (req.user.role !== "booking_agent") {
      return res
        .status(403)
        .json({ message: "Only booking agents can add passengers" });
    }

    const { name, age, phone } = req.body;

    // Validation
    if (!name || !age || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (isNaN(age) || age <= 0) {
      return res.status(400).json({ message: "Age must be a positive number" });
    }
    if (!/^\d{11}$/.test(phone)) {
      return res.status(400).json({ message: "Phone must be 11 digits" });
    }

    // ✅ Ensure agencyId is always set
    if (!req.user.agencyId) {
      return res
        .status(400)
        .json({ message: "Your account is not linked with any agency" });
    }

    const passenger = await Passenger.create({
      name,
      age,
      phone,
      agencyId: req.user.agencyId,
    });

    res.status(201).json(passenger);
  } catch (error) {
    console.error("Error creating passenger:", error);
    res
      .status(500)
      .json({ message: "Error creating passenger", error: error.message });
  }
};

// ✅ Update passenger
export const updatePassenger = async (req, res) => {
  try {
    if (req.user.role !== "booking_agent") {
      return res
        .status(403)
        .json({ message: "Only booking agents can update passengers" });
    }

    const { id } = req.params;
    const { name, age, phone } = req.body;

    const passenger = await Passenger.findOne({
      where: { id, agencyId: req.user.agencyId },
    });

    if (!passenger) {
      return res
        .status(404)
        .json({ message: "Passenger not found or not in your agency" });
    }

    // Validation
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
    res
      .status(500)
      .json({ message: "Error updating passenger", error: error.message });
  }
};

// ✅ Delete passenger
export const deletePassenger = async (req, res) => {
  try {
    if (req.user.role !== "booking_agent") {
      return res
        .status(403)
        .json({ message: "Only booking agents can delete passengers" });
    }

    const { id } = req.params;

    const passenger = await Passenger.findOne({
      where: { id, agencyId: req.user.agencyId },
    });

    if (!passenger) {
      return res
        .status(404)
        .json({ message: "Passenger not found or not in your agency" });
    }

    await passenger.destroy();

    res.status(200).json({ message: "Passenger deleted successfully" });
  } catch (error) {
    console.error("Error deleting passenger:", error);
    res
      .status(500)
      .json({ message: "Error deleting passenger", error: error.message });
  }
};
