import db from "../models/index.js";
const { Trip, Booking } = db;

export const getSeatUtilization = async (req, res) => {
  try {
    const { agencyId } = req.params;

    const trips = await Trip.findAll({ where: { agencyId } });

    let bookedSeats = 0;
    let availableSeats = 0;

    for (const trip of trips) {
      // sab bookings le ao
      const bookings = await Booking.findAll({ where: { tripId: trip.id } });

      // is trip ke booked seats
      const tripBooked = bookings.reduce(
        (sum, b) => sum + (b.seats || 0), 
        0
      );

      bookedSeats += tripBooked;

      // ab available ka matlab = total - booked
      availableSeats += Math.max(trip.seatsAvailable - tripBooked, 0);
    }

    res.json({ bookedSeats, availableSeats });
  } catch (err) {
    console.error("Seat Utilization error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
