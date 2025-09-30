// export const createTrip = async (req, res) => {
//   try {
//     const { from, to, depart, mode, classType, price, seatsAvailable, agencyId: bodyAgencyId } = req.body;

//     const agencyId = bodyAgencyId || req.user.agencyId;
//     if (!agencyId) return res.status(400).json({ message: "No agency selected. Please switch agency." });

//     if (req.user.role !== "owner") return res.status(403).json({ message: "Only owner can create trips" });

//     // Basic validations
//     if (!from || !to || !depart || !mode || !classType || !price || !seatsAvailable)
//       return res.status(400).json({ message: "All fields are required" });
//     if (from.toLowerCase() === to.toLowerCase())
//       return res.status(400).json({ message: "Source and destination cannot be the same" });
//     if (price <= 0 || seatsAvailable <= 0)
//       return res.status(400).json({ message: "Price and seats must be greater than 0" });
    
//     const departDate = new Date(depart);
//     if (isNaN(departDate.getTime()) || departDate < new Date())
//       return res.status(400).json({ message: "Invalid or past departure date" });

//     const newTrip = await Trip.create({ from, to, depart, mode, classType, price, seatsAvailable, agencyId });
//     res.status(201).json({ message: "Trip created successfully", trip: newTrip });
//   } catch (err) {
//     console.error("Error creating trip:", err);
//     res.status(500).json({ message: "Failed to create trip", error: err.message });
//   }
// };
// Create Trip (accept agencyId from body or query)
import db from "../models/index.js";
const { Trip, User, Agency } = db;

export const createTrip = async (req, res) => {
  try {
    const {
      from, to, depart, mode, classType, price, seatsAvailable
    } = req.body;

    // take agencyId from body OR query OR token
    const agencyId = req.body.agencyId || req.query.agencyId || req.user?.agencyId;
    if (!agencyId) return res.status(400).json({ message: "No agency selected. Please switch agency." });

    // If you want only owners to create trips (keep existing logic)
    if (req.user.role !== "owner") return res.status(403).json({ message: "Only owner can create trips" });

    // Validations (as before)
    if (!from || !to || !depart || !mode || !classType || !price || !seatsAvailable)
      return res.status(400).json({ message: "All fields are required" });
    if (from.toLowerCase() === to.toLowerCase())
      return res.status(400).json({ message: "Source and destination cannot be the same" });
    if (price <= 0 || seatsAvailable <= 0)
      return res.status(400).json({ message: "Price and seats must be greater than 0" });

    const departDate = new Date(depart);
    if (isNaN(departDate.getTime()) || departDate < new Date())
      return res.status(400).json({ message: "Invalid or past departure date" });

    const newTrip = await Trip.create({
      from, to, depart, mode, classType, price, seatsAvailable, agencyId
    });

    res.status(201).json({ message: "Trip created successfully", trip: newTrip });
  } catch (err) {
    console.error("Error creating trip:", err);
    res.status(500).json({ message: "Failed to create trip", error: err.message });
  }
};

// export const getAllTrips = async (req, res) => {
//   try {
//     if (req.user.role !== "owner") {
//       return res.status(403).json({ message: "Only owner can view trips" });
//     }

//     const agencyId = req.user.agencyId; // 👈 token se lena hai
//     if (!agencyId) {
//       return res.status(400).json({ message: "No agency selected. Please switch agency." });
//     }

//     const trips = await Trip.findAll({
//       where: { agencyId },
//       include: [{ model: Agency, as: "agency" }]
//     });

//     res.status(200).json(trips);
//   } catch (error) {
//     console.error("Error fetching trips:", error);
//     res.status(500).json({ message: "Failed to fetch trips", error: error.message });
//   }
// };
export const getAllTrips = async (req, res) => {
  try {
    // prefer query param, fallback to token
    const agencyId = req.query.agencyId || req.user?.agencyId;
    if (!agencyId) return res.status(400).json({ message: "No agency selected. Please switch agency." });

    // Optional: verify user actually belongs to the agency (recommended)
    const user = await User.findByPk(req.user.id);
    const agencies = await user.getAgencies({ through: { attributes: [] } });
    if (!agencies.some(a => a.id === Number(agencyId))) {
      return res.status(403).json({ message: "You are not allowed to view trips for this agency" });
    }

    const trips = await Trip.findAll({
      where: { agencyId },
      include: [{ model: Agency, as: "agency" }]
    });

    res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: "Failed to fetch trips", error: error.message });
  }
};

// ✅ Get Trip by ID
export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findByPk(id, {
      include: [{ model: Agency, as: "agency" }]
    });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (req.user.role === "owner") {
      const user = await User.findByPk(req.user.id);
      const agencies = await user.getAgencies({ through: { where: { role: "owner" } } });
      const agencyIds = agencies.map(a => a.id);

      if (!agencyIds.includes(trip.agencyId)) {
        return res.status(403).json({ message: "You are not allowed to access this trip" });
      }
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ message: "Failed to fetch trip", error: error.message });
  }
};

// // ✅ Update Trip
// export const updateTrip = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { from, to, depart, price, seatsAvailable } = req.body;

//     const trip = await Trip.findByPk(id);
//     if (!trip) return res.status(404).json({ message: "Trip not found" });

//     const user = await User.findByPk(req.user.id);
//     const agencies = await user.getAgencies({ through: { where: { role: "owner" } } });
//     const agencyIds = agencies.map(a => a.id);

//     if (!agencyIds.includes(trip.agencyId)) {
//       return res.status(403).json({ message: "You are not allowed to update this trip" });
//     }

//     if (from && to && from.toLowerCase() === to.toLowerCase()) {
//       return res.status(400).json({ message: "Source and destination cannot be the same" });
//     }
//     if (price !== undefined && price <= 0) {
//       return res.status(400).json({ message: "Price must be greater than 0" });
//     }
//     if (seatsAvailable !== undefined && seatsAvailable <= 0) {
//       return res.status(400).json({ message: "Seats available must be at least 1" });
//     }
//     if (depart) {
//       const departDate = new Date(depart);
//       if (isNaN(departDate.getTime())) {
//         return res.status(400).json({ message: "Invalid departure date format" });
//       }
//       if (departDate < new Date()) {
//         return res.status(400).json({ message: "Departure date cannot be in the past" });
//       }
//     }

//     await trip.update(req.body);
//     res.status(200).json({ message: "Trip updated successfully", trip });
//   } catch (error) {
//     console.error("Error updating trip:", error);
//     res.status(500).json({ message: "Failed to update trip", error: error.message });
//   }
// };

// // ✅ Delete Trip
// export const deleteTrip = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const trip = await Trip.findByPk(id);
//     if (!trip) return res.status(404).json({ message: "Trip not found" });

//     const user = await User.findByPk(req.user.id);
//     const agencies = await user.getAgencies({ through: { where: { role: "owner" } } });
//     const agencyIds = agencies.map(a => a.id);

//     if (!agencyIds.includes(trip.agencyId)) {
//       return res.status(403).json({ message: "You are not allowed to delete this trip" });
//     }

//     await trip.destroy();
//     res.status(200).json({ message: "Trip deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting trip:", error);
//     res.status(500).json({ message: "Failed to delete trip", error: error.message });
//   }
// };

// ✅ Update Trip
export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, depart, price, seatsAvailable } = req.body;

    const trip = await Trip.findByPk(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // 👉 check user role directly from token
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owner can update trips" });
    }

    // 👉 verify user actually belongs to trip's agency
    const user = await User.findByPk(req.user.id);
    const agencies = await user.getAgencies({ through: { attributes: [] } });
    if (!agencies.some(a => a.id === trip.agencyId)) {
      return res.status(403).json({ message: "You are not allowed to update this trip" });
    }

    // Validations
    if (from && to && from.toLowerCase() === to.toLowerCase()) {
      return res.status(400).json({ message: "Source and destination cannot be the same" });
    }
    if (price !== undefined && price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }
    if (seatsAvailable !== undefined && seatsAvailable <= 0) {
      return res.status(400).json({ message: "Seats available must be at least 1" });
    }
    if (depart) {
      const departDate = new Date(depart);
      if (isNaN(departDate.getTime())) {
        return res.status(400).json({ message: "Invalid departure date format" });
      }
      if (departDate < new Date()) {
        return res.status(400).json({ message: "Departure date cannot be in the past" });
      }
    }

    await trip.update(req.body);
    res.status(200).json({ message: "Trip updated successfully", trip });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ message: "Failed to update trip", error: error.message });
  }
};

// ✅ Delete Trip
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findByPk(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // 👉 check user role
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owner can delete trips" });
    }

    // 👉 verify user belongs to agency
    const user = await User.findByPk(req.user.id);
    const agencies = await user.getAgencies({ through: { attributes: [] } });
    if (!agencies.some(a => a.id === trip.agencyId)) {
      return res.status(403).json({ message: "You are not allowed to delete this trip" });
    }

    await trip.destroy();
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ message: "Failed to delete trip", error: error.message });
  }
};
