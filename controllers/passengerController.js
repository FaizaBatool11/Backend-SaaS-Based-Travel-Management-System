// import db from "../models/index.js";  // sequelize models import
// const { Passenger } = db;

// // ✅ Get all passengers
// export const getAllPassengers = async (req, res) => {
//   try {
//     const passengers = await Passenger.findAll();
//     res.status(200).json(passengers);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching passengers", error });
//   }
// };

// // ✅ Get passenger by ID
// export const getPassengerById = async (req, res) => {
//   try {
//     const passenger = await Passenger.findByPk(req.params.id);
//     if (!passenger) {
//       return res.status(404).json({ message: "Passenger not found" });
//     }
//     res.status(200).json(passenger);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching passenger", error });
//   }
// };

// // ✅ Add passenger
// export const createPassenger = async (req, res) => {
//   try {
//     const { name, age, phone } = req.body;

//     if (!name || !age || !phone) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const passenger = await Passenger.create({ name, age, phone });
//     res.status(201).json(passenger);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating passenger", error });
//   }
// };

// // ✅ Update passenger
// export const updatePassenger = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, age, phone } = req.body;

//     const passenger = await Passenger.findByPk(id);
//     if (!passenger) {
//       return res.status(404).json({ message: "Passenger not found" });
//     }

//     passenger.name = name ?? passenger.name;
//     passenger.age = age ?? passenger.age;
//     passenger.phone = phone ?? passenger.phone;

//     await passenger.save();
//     res.status(200).json(passenger);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating passenger", error });
//   }
// };

// // ✅ Delete passenger
// export const deletePassenger = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const passenger = await Passenger.findByPk(id);
//     if (!passenger) {
//       return res.status(404).json({ message: "Passenger not found" });
//     }

//     await passenger.destroy();
//     res.status(200).json({ message: "Passenger deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting passenger", error });
//   }
// };
import db from "../models/index.js";  // sequelize models import
const { Passenger } = db;

// ✅ Get all passengers (everyone can view)
export const getAllPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.findAll();
    res.status(200).json(passengers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching passengers", error });
  }
};

// ✅ Get passenger by ID (everyone can view)
export const getPassengerById = async (req, res) => {
  try {
    const passenger = await Passenger.findByPk(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }
    res.status(200).json(passenger);
  } catch (error) {
    res.status(500).json({ message: "Error fetching passenger", error });
  }
};

// ✅ Add passenger (only booking_agent)
export const createPassenger = async (req, res) => {
  try {
    if (req.user.role !== "booking_agent") {
      return res.status(403).json({ message: "Only booking agents can add passengers" });
    }

    const { name, age, phone } = req.body;

    // validations
    if (!name || !age || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (isNaN(age) || age <= 0) {
      return res.status(400).json({ message: "Age must be a positive number" });
    }
    if (!/^\d{11}$/.test(phone)) {
      return res.status(400).json({ message: "Phone must be 11 digits" });
    }

    const passenger = await Passenger.create({ name, age, phone });
    res.status(201).json(passenger);
  } catch (error) {
    res.status(500).json({ message: "Error creating passenger", error });
  }
};

// ✅ Update passenger (only booking_agent)
export const updatePassenger = async (req, res) => {
  try {
    if (req.user.role !== "booking_agent") {
      return res.status(403).json({ message: "Only booking agents can update passengers" });
    }

    const { id } = req.params;
    const { name, age, phone } = req.body;

    const passenger = await Passenger.findByPk(id);
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
    res.status(500).json({ message: "Error updating passenger", error });
  }
};

// ✅ Delete passenger (only booking_agent)
export const deletePassenger = async (req, res) => {
  try {
    if (req.user.role !== "booking_agent") {
      return res.status(403).json({ message: "Only booking agents can delete passengers" });
    }

    const { id } = req.params;
    const passenger = await Passenger.findByPk(id);

    if (!passenger) {
      return res.status(404).json({ message: "Passenger not found" });
    }

    await passenger.destroy();
    res.status(200).json({ message: "Passenger deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting passenger", error });
  }
};
