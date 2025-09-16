import db from "../models/index.js";
import { Op } from "sequelize";
const { Trip, Agency, User } = db;

// ✅ Create a new Trip
// export const createTrip = async (req, res) => {
//   try {
//     const { from, to, depart, mode, classType, price, seatsAvailable, agencyId } = req.body;

//     if (!from || !to || !depart || !mode || !classType || !price || !seatsAvailable) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (req.user.role !== "owner") {
//       return res.status(403).json({ message: "Only owner can create trips" });
//     }

//     // 🔹 Get the agency linked to this admin
//     const user = await User.findByPk(req.user.id);
//     const agencies = await user.getAgencies({
//       through: { where: { role: "owner" } }
//     });

//     if (agencies.length === 0) {
//       return res.status(403).json({ message: "You are not linked to any agency" });
//     }

//     if (!agencies.some(a => a.id === Number(agencyId))) {
//       return res.status(403).json({ message: "You are not linked to this agency" });
//     }

//     // 🔹 Business validations
//     if (from.toLowerCase() === to.toLowerCase()) {
//       return res.status(400).json({ message: "Source and destination cannot be the same" });
//     }
//     if (price <= 0) {
//       return res.status(400).json({ message: "Price must be greater than 0" });
//     }
//     if (seatsAvailable <= 0) {
//       return res.status(400).json({ message: "Seats available must be at least 1" });
//     }
//     const departDate = new Date(depart);
//     if (isNaN(departDate.getTime())) {
//       return res.status(400).json({ message: "Invalid departure date format" });
//     }
//     if (departDate < new Date()) {
//       return res.status(400).json({ message: "Departure date cannot be in the past" });
//     }

//     const newTrip = await Trip.create({
//       from, to, depart, mode, classType, price, seatsAvailable,
//       agencyId: Number(agencyId)
//     });

//     res.status(201).json({ message: "Trip created successfully", trip: newTrip });
//   } catch (error) {
//     console.error("Error creating trip:", error);
//     res.status(500).json({ message: "Failed to create trip", error: error.message });
//   }
// };
export const createTrip = async (req, res) => {
  try {
    const { from, to, depart, mode, classType, price, seatsAvailable } = req.body;

    if (!from || !to || !depart || !mode || !classType || !price || !seatsAvailable) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owner can create trips" });
    }

    const agencyId = req.user.agencyId; // 👈 JWT se
    if (!agencyId) {
      return res.status(400).json({ message: "No agency selected. Please switch agency." });
    }

    // 🔹 Business validations
    if (from.toLowerCase() === to.toLowerCase()) {
      return res.status(400).json({ message: "Source and destination cannot be the same" });
    }
    if (price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }
    if (seatsAvailable <= 0) {
      return res.status(400).json({ message: "Seats available must be at least 1" });
    }
    const departDate = new Date(depart);
    if (isNaN(departDate.getTime())) {
      return res.status(400).json({ message: "Invalid departure date format" });
    }
    if (departDate < new Date()) {
      return res.status(400).json({ message: "Departure date cannot be in the past" });
    }

    const newTrip = await Trip.create({
      from, to, depart, mode, classType, price, seatsAvailable,
      agencyId
    });

    res.status(201).json({ message: "Trip created successfully", trip: newTrip });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ message: "Failed to create trip", error: error.message });
  }
};

// ✅ Get all Trips of user's agencies
// export const getAllTrips = async (req, res) => {
//   try {
//     if (req.user.role !== "owner") {
//       return res.status(403).json({ message: "Only owner can view trips" });
//     }

//     const user = await User.findByPk(req.user.id);
//     const agencies = await user.getAgencies({ through: { attributes: [] } });

//     const AgencyId = req.query.agencyId; // frontend se pass hoga
//     const agencyIds = AgencyId ? [Number(AgencyId)] : agencies.map(a => a.id);

//     // check that AgencyId belongs to this user
//     if (AgencyId && !agencies.some(a => a.id === Number(AgencyId))) {
//       return res.status(403).json({ message: "You don't have access to this agency" });
//     } 

//     const trips = await Trip.findAll({
//       where: { agencyId: { [Op.in]: agencyIds } },
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
    if (req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owner can view trips" });
    }

    const agencyId = req.user.agencyId; // 👈 token se lena hai
    if (!agencyId) {
      return res.status(400).json({ message: "No agency selected. Please switch agency." });
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

// ✅ Update Trip
export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, depart, price, seatsAvailable } = req.body;

    const trip = await Trip.findByPk(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const user = await User.findByPk(req.user.id);
    const agencies = await user.getAgencies({ through: { where: { role: "owner" } } });
    const agencyIds = agencies.map(a => a.id);

    if (!agencyIds.includes(trip.agencyId)) {
      return res.status(403).json({ message: "You are not allowed to update this trip" });
    }

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

    const user = await User.findByPk(req.user.id);
    const agencies = await user.getAgencies({ through: { where: { role: "owner" } } });
    const agencyIds = agencies.map(a => a.id);

    if (!agencyIds.includes(trip.agencyId)) {
      return res.status(403).json({ message: "You are not allowed to delete this trip" });
    }

    await trip.destroy();
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ message: "Failed to delete trip", error: error.message });
  }
};

// export const getTripsForBookingAgent = async (req, res) => {
//   try {
//     if (req.user.role !== "booking_agent") {
//       return res.status(403).json({ message: "Only booking agents can view trips" });
//     }

//     // get agent's linked agencies
//     const user = await User.findByPk(req.user.id);
//     const agencies = await user.getAgencies({ through: { attributes: [] } });
//     const linkedAgencyIds = agencies.map(a => a.id); // e.g. [3]

//     // agencyId from query (frontend will pass when using dynamic route)
//     const requestedAgencyId = req.query.agencyId ? Number(req.query.agencyId) : null;

//     // if agent has no linked agencies and no agencyId requested -> deny
//     if (linkedAgencyIds.length === 0 && !requestedAgencyId) {
//       return res.status(403).json({ message: "You are not assigned to any agency. Contact admin." });
//     }

//     // if a requestedAgencyId present, ensure agent is linked to it
//     if (requestedAgencyId) {
//       if (!linkedAgencyIds.includes(requestedAgencyId)) {
//         return res.status(403).json({ message: "You are not linked to this agency." });
//       }
//     }

//     // choose the agency ids to fetch trips for:
//     const agencyIdsToUse = requestedAgencyId ? [requestedAgencyId] : linkedAgencyIds;

//     const trips = await Trip.findAll({
//       where: { agencyId: { [Op.in]: agencyIdsToUse } },
//       order: [["depart", "ASC"]],
//       include: [{ model: Agency, as: "agency", attributes: ["id", "name"] }], // optional
//     });

//     return res.status(200).json(trips);
//   } catch (error) {
//     console.error("Error fetching trips for booking agent:", error);
//     return res.status(500).json({ message: "Failed to fetch trips", error: error.message });
//   }
// };