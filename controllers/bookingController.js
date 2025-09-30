// import { Booking, Trip, Passenger } from "../models/index.js";

// // ✅ Create Booking
// export const createBooking = async (req, res) => {
//   try {
//     const { tripId, passengerId } = req.body;

//     if (!tripId || !passengerId) {
//       return res.status(400).json({ message: "TripId and PassengerId required" });
//     }

//     const trip = await Trip.findByPk(tripId);
//     if (!trip) return res.status(404).json({ message: "Trip not found" });

//     const passenger = await Passenger.findByPk(passengerId);
//     if (!passenger) return res.status(404).json({ message: "Passenger not found" });

//     const existingBooking = await Booking.findOne({ where: { tripId, passengerId } });
//     if (existingBooking) return res.status(400).json({ message: "Passenger already booked for this trip" });

//     const booking = await Booking.create({
//       tripId,
//       passengerId,
//       createdBy: req.user.id,
//     });

//     res.status(201).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// // ✅ Get all bookings for current agent
// export const getBookings = async (req, res) => {
//   try {
//     // 1️⃣ Only booking agents can fetch their bookings
//     if (req.user.role !== "booking_agent") {
//       return res.status(403).json({ message: "Only booking agents can view bookings" });
//     }

//     // 2️⃣ Fetch bookings for this agent with proper relations
//     const bookings = await Booking.findAll({
//       where: { createdBy: req.user.id },
//       include: [
//         { model: Trip, as: "trip" },
//         { model: Passenger, as: "passenger" },
//       ],
//       order: [["createdAt", "DESC"]], // optional: latest first
//     });

//     // 3️⃣ Check if any bookings exist
//     if (!bookings || bookings.length === 0) {
//       return res.status(200).json({ message: "No bookings found", bookings: [] });
//     }

//     // 4️⃣ Return bookings
//     res.json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching bookings", error: error.message });
//   }
// };


// // ✅ Cancel Booking
// export const cancelBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findOne({
//       where: { id: req.params.id, createdBy: req.user.id },
//     });

//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     if (booking.status === "cancelled") {
//       return res.status(400).json({ message: "Booking is already cancelled" });
//     }

//     booking.status = "cancelled";
//     await booking.save();

//     res.json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import db from "../models/index.js";
const { Booking, Trip, Passenger } = db;

// ✅ Create Booking (Owner can book for their agency)
export const createBooking = async (req, res) => {
  try {
    const { tripId, passengerId } = req.body;

    if (!tripId || !passengerId) {
      return res.status(400).json({ message: "TripId and PassengerId required" });
    }

    // ✅ Check Trip belongs to owner's agency
    const trip = await Trip.findOne({
      where: { id: tripId, agencyId: req.user.agencyId },
    });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found in your agency" });
    }

    // ✅ Check Passenger belongs to owner's agency
    const passenger = await Passenger.findOne({
      where: { id: passengerId, agencyId: req.user.agencyId },
    });
    if (!passenger) {
      return res.status(404).json({ message: "Passenger not found in your agency" });
    }

    // ✅ Prevent duplicate booking
    const existingBooking = await Booking.findOne({
      where: { tripId, passengerId, agencyId: req.user.agencyId },
    });
    if (existingBooking) {
      return res.status(400).json({ message: "Passenger already booked for this trip" });
    }

    // ✅ Create booking
  const booking = await Booking.create({
  tripId,
  passengerId,
  seats: req.body.seats, // 👈 save seats
  status: "pending",
  createdBy: req.user.id,
  agencyId: req.user.agencyId, 
});

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all bookings for current owner (filtered by agency)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { agencyId: req.user.agencyId },
      include: [
        { model: Trip, as: "trip" },
        { model: Passenger, as: "passenger" },
      ],
      order: [["id", "ASC"]],
    });

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({ message: "No bookings found", bookings: [] });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// ✅ Cancel Booking (only within same agency)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        agencyId: req.user.agencyId, // ensure same agency
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found in your agency" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, seats } = req.body;

    const booking = await Booking.findOne({
      where: { id, agencyId: req.user.agencyId },
      include: [
        { model: Trip, as: "trip" },
        { model: Passenger, as: "passenger" },
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found in your agency" });
    }

    if (status) booking.status = status;
    if (seats !== undefined) booking.seats = seats;

    await booking.save();

    // 👇 Always return with passenger + trip so frontend me N/A na aaye
    const updatedBooking = await Booking.findOne({
      where: { id: booking.id },
      include: [
        { model: Trip, as: "trip" },
        { model: Passenger, as: "passenger" },
      ],
    });

    res.json({ booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
