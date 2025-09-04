// import db from "../models/index.js"; // sequelize models ko import karna
// const { Trip, Agency } = db;

// // ✅ Create a new Trip
// export const createTrip = async (req, res) => {
//   try {
//     const { from, to, depart, mode, classType, price, seatsAvailable} = req.body;

//     if (!from || !to || !depart || !mode || !classType || !price || !seatsAvailable) {
//        return res.status(400).json({ message: "All fields are required" });
//     }

//     if (req.user.role !== "agency_admin") {
//        return res.status(403).json({ message: "Only agency admins can create trips" });
//     }

//     const newTrip = await Trip.create({
//       from,
//       to,
//       depart,
//       mode,
//       classType,
//       price,
//       seatsAvailable,
//       agencyId: req.user.agencyId
//     });

//     res.status(201).json({
//       message: "Trip created successfully",
//       trip: newTrip,
//     });
//   } catch (error) {
//     console.error("Error creating trip:", error);
//     res.status(500).json({ message: "Failed to create trip", error });
//   }
// };

// // ✅ Get all Trips
// export const getAllTrips = async (req, res) => {
//   try {
//     const trips = await Trip.findAll({
//       include: [{ model: Agency, as: "agency" }],
//     });
//     res.status(200).json(trips);
//   } catch (error) {
//     console.error("Error fetching trips:", error);
//     res.status(500).json({ message: "Failed to fetch trips", error });
//   }
// };

// // ✅ Get Trip by ID
// export const getTripById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const trip = await Trip.findByPk(id, {
//       include: [{ model: Agency, as: "agency" }],
//     });

//     if (!trip) {
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     res.status(200).json(trip);
//   } catch (error) {
//     console.error("Error fetching trip:", error);
//     res.status(500).json({ message: "Failed to fetch trip", error });
//   }
// };

// // ✅ Update Trip
// export const updateTrip = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const trip = await Trip.findByPk(id);
//     if (!trip) {
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     await trip.update(req.body);

//     res.status(200).json({
//       message: "Trip updated successfully",
//       trip,
//     });
//   } catch (error) {
//     console.error("Error updating trip:", error);
//     res.status(500).json({ message: "Failed to update trip", error });
//   }
// };

// // ✅ Delete Trip
// export const deleteTrip = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const trip = await Trip.findByPk(id);
//     if (!trip) {
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     await trip.destroy();

//     res.status(200).json({ message: "Trip deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting trip:", error);
//     res.status(500).json({ message: "Failed to delete trip", error });
//   }
// };

// import db from "../models/index.js"; // sequelize models ko import karna
// const { Trip, Agency } = db;

// // ✅ Create a new Trip
// export const createTrip = async (req, res) => {
//   try {
//     const { from, to, depart, mode, classType, price, seatsAvailable } = req.body;

//     // 🔹 Required fields check
//     if (!from || !to || !depart || !mode || !classType || !price || !seatsAvailable) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // 🔹 Role check
//     if (req.user.role !== "agency_admin") {
//       return res.status(403).json({ message: "Only agency admins can create trips" });
//     }

//     // 🔹 Business Logic Validations
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

//     // ✅ Create trip
//     const newTrip = await Trip.create({
//       from,
//       to,
//       depart,
//       mode,
//       classType,
//       price,
//       seatsAvailable,
//       agencyId: req.user.agencyId,
//     });

//     res.status(201).json({
//       message: "Trip created successfully",
//       trip: newTrip,
//     });
//   } catch (error) {
//     console.error("Error creating trip:", error);
//     res.status(500).json({ message: "Failed to create trip", error });
//   }
// };

// // ✅ Get all Trips
// export const getAllTrips = async (req, res) => {
//   try {

//     // 🔹 Role check
//     if (req.user.role !== "agency_admin") {
//       return res.status(403).json({ message: "Only agency admins can view trips" });
//     }

//     //🔹 Fetch only trips of the logged-in admin's agency
//     const trips = await Trip.findAll({
//       where: { agencyId: req.user.agencyId },
//       include: [{ model: Agency, as: "agency" }],
//     });
//     res.status(200).json(trips);
//   } catch (error) {
//     console.error("Error fetching trips:", error);
//     res.status(500).json({ message: "Failed to fetch trips", error });
//   }
// };

// // ✅ Get Trip by ID
// export const getTripById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const trip = await Trip.findByPk(id, {
//       include: [{ model: Agency, as: "agency" }],
//     });

//     if (!trip) {
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     // 🔹 Role & agency check
//     if (req.user.role === "agency_admin" && trip.agencyId !== req.user.agencyId) {
//       return res.status(403).json({ message: "You are not allowed to access this trip" });
//     }

//     res.status(200).json(trip);
//   } catch (error) {
//     console.error("Error fetching trip:", error);
//     res.status(500).json({ message: "Failed to fetch trip", error });
//   }
// };

// // ✅ Update Trip
// export const updateTrip = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { from, to, depart, price, seatsAvailable } = req.body;

//     const trip = await Trip.findByPk(id);
//     if (!trip) {
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     // 🔹 Business logic checks on update
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

//     res.status(200).json({
//       message: "Trip updated successfully",
//       trip,
//     });
//   } catch (error) {
//     console.error("Error updating trip:", error);
//     res.status(500).json({ message: "Failed to update trip", error });
//   }
// };

// // ✅ Delete Trip
// export const deleteTrip = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const trip = await Trip.findByPk(id);
//     if (!trip) {
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     await trip.destroy();

//     res.status(200).json({ message: "Trip deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting trip:", error);
//     res.status(500).json({ message: "Failed to delete trip", error });
//   }
// };

// import db from "../models/index.js"; 
// const { Trip, Agency, UserAgency } = db;

// // ✅ Create a new Trip
// export const createTrip = async (req, res) => {
//   try {
//     const { from, to, depart, mode, classType, price, seatsAvailable, agencyId } = req.body;

//     if (!from || !to || !depart || !mode || !classType || !price || !seatsAvailable) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // 🔹 Role check
//     if (req.user.role !== "agency_admin") {
//       return res.status(403).json({ message: "Only agency admins can create trips" });
//     }

//     // 🔹 Check if user belongs to that agency
//     const userAgency = await UserAgency.findOne({
//       where: { userId: req.user.id, agencyId }
//     });
//     if (!userAgency) {
//       return res.status(403).json({ message: "You are not allowed to create trips for this agency" });
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
//       from, to, depart, mode, classType, price, seatsAvailable, agencyId
//     });

//     res.status(201).json({ message: "Trip created successfully", trip: newTrip });
//   } catch (error) {
//     console.error("Error creating trip:", error);
//     res.status(500).json({ message: "Failed to create trip", error });
//   }
// };

// // ✅ Get all Trips of user's agencies
// export const getAllTrips = async (req, res) => {
//   try {
//     if (req.user.role !== "agency_admin") {
//       return res.status(403).json({ message: "Only agency admins can view trips" });
//     }

//     // 🔹 find all agencies linked to this user
//     const userAgencies = await UserAgency.findAll({ where: { userId: req.user.id } });
//     const agencyIds = userAgencies.map(ua => ua.agencyId);

//     const trips = await Trip.findAll({
//       where: { agencyId: agencyIds },
//       include: [{ model: Agency, as: "agency" }]
//     });

//     res.status(200).json(trips);
//   } catch (error) {
//     console.error("Error fetching trips:", error);
//     res.status(500).json({ message: "Failed to fetch trips", error });
//   }
// };

// // ✅ Get Trip by ID
// export const getTripById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const trip = await Trip.findByPk(id, {
//       include: [{ model: Agency, as: "agency" }]
//     });
//     if (!trip) return res.status(404).json({ message: "Trip not found" });

//     // 🔹 Check if user belongs to the agency of this trip
//     if (req.user.role === "agency_admin") {
//       const userAgency = await UserAgency.findOne({
//         where: { userId: req.user.id, agencyId: trip.agencyId }
//       });
//       if (!userAgency) {
//         return res.status(403).json({ message: "You are not allowed to access this trip" });
//       }
//     }

//     res.status(200).json(trip);
//   } catch (error) {
//     console.error("Error fetching trip:", error);
//     res.status(500).json({ message: "Failed to fetch trip", error });
//   }
// };

// // ✅ Update Trip
// export const updateTrip = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { from, to, depart, price, seatsAvailable } = req.body;

//     const trip = await Trip.findByPk(id);
//     if (!trip) return res.status(404).json({ message: "Trip not found" });

//     // 🔹 Ensure user is admin of this agency
//     const userAgency = await UserAgency.findOne({
//       where: { userId: req.user.id, agencyId: trip.agencyId }
//     });
//     if (!userAgency) {
//       return res.status(403).json({ message: "You are not allowed to update this trip" });
//     }

//     // Business validations
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
//     res.status(500).json({ message: "Failed to update trip", error });
//   }
// };

// // ✅ Delete Trip
// export const deleteTrip = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const trip = await Trip.findByPk(id);
//     if (!trip) return res.status(404).json({ message: "Trip not found" });

//     const userAgency = await UserAgency.findOne({
//       where: { userId: req.user.id, agencyId: trip.agencyId }
//     });
//     if (!userAgency) {
//       return res.status(403).json({ message: "You are not allowed to delete this trip" });
//     }

//     await trip.destroy();
//     res.status(200).json({ message: "Trip deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting trip:", error);
//     res.status(500).json({ message: "Failed to delete trip", error });
//   }
// };

import db from "../models/index.js";
import { Op } from "sequelize";
const { Trip, Agency, User } = db;

// ✅ Create a new Trip
export const createTrip = async (req, res) => {
  try {
    const { from, to, depart, mode, classType, price, seatsAvailable, agencyId } = req.body;

    if (!from || !to || !depart || !mode || !classType || !price || !seatsAvailable) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (req.user.role !== "agency_admin") {
      return res.status(403).json({ message: "Only agency admins can create trips" });
    }

    // 🔹 Get the agency linked to this admin
    const user = await User.findByPk(req.user.id);
    const agencies = await user.getAgencies({
      through: { where: { role: "owner" } }
    });

    if (agencies.length === 0) {
      return res.status(403).json({ message: "You are not linked to any agency" });
    }

    if (!agencies.some(a => a.id === Number(agencyId))) {
      return res.status(403).json({ message: "You are not linked to this agency" });
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
      agencyId: Number(agencyId)
    });

    res.status(201).json({ message: "Trip created successfully", trip: newTrip });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ message: "Failed to create trip", error: error.message });
  }
};

// ✅ Get all Trips of user's agencies
export const getAllTrips = async (req, res) => {
  try {
    if (req.user.role !== "agency_admin") {
      return res.status(403).json({ message: "Only agency admins can view trips" });
    }

    const user = await User.findByPk(req.user.id);
    const agencies = await user.getAgencies({ through: { attributes: [] } });

    const AgencyId = req.query.agencyId; // frontend se pass hoga
    const agencyIds = AgencyId ? [Number(AgencyId)] : agencies.map(a => a.id);

    // check that AgencyId belongs to this user
    if (AgencyId && !agencies.some(a => a.id === Number(AgencyId))) {
      return res.status(403).json({ message: "You don't have access to this agency" });
    } 

    const trips = await Trip.findAll({
      where: { agencyId: { [Op.in]: agencyIds } },
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

    if (req.user.role === "agency_admin") {
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

export const getTripsForBookingAgent = async (req, res) => {
  try {
    if (req.user.role !== "booking_agent") {
      return res.status(403).json({ message: "Only booking agents can view trips" });
    }

    // get agent's linked agencies
    const user = await User.findByPk(req.user.id);
    const agencies = await user.getAgencies({ through: { attributes: [] } });
    const linkedAgencyIds = agencies.map(a => a.id); // e.g. [3]

    // agencyId from query (frontend will pass when using dynamic route)
    const requestedAgencyId = req.query.agencyId ? Number(req.query.agencyId) : null;

    // if agent has no linked agencies and no agencyId requested -> deny
    if (linkedAgencyIds.length === 0 && !requestedAgencyId) {
      return res.status(403).json({ message: "You are not assigned to any agency. Contact admin." });
    }

    // if a requestedAgencyId present, ensure agent is linked to it
    if (requestedAgencyId) {
      if (!linkedAgencyIds.includes(requestedAgencyId)) {
        return res.status(403).json({ message: "You are not linked to this agency." });
      }
    }

    // choose the agency ids to fetch trips for:
    const agencyIdsToUse = requestedAgencyId ? [requestedAgencyId] : linkedAgencyIds;

    const trips = await Trip.findAll({
      where: { agencyId: { [Op.in]: agencyIdsToUse } },
      order: [["depart", "ASC"]],
      include: [{ model: Agency, as: "agency", attributes: ["id", "name"] }], // optional
    });

    return res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching trips for booking agent:", error);
    return res.status(500).json({ message: "Failed to fetch trips", error: error.message });
  }
};