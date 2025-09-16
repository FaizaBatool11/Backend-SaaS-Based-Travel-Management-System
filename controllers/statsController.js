// controller/dashboardController.js
import db from "../models/index.js";
const { Booking, Trip, Passenger, Payment } = db;

export const getDashboardStats = async (req, res) => {
  try {
    const { agencyId } = req.params;

    const trips = await Trip.count({ where: { agencyId } });
    const bookings = await Booking.count({ where: { agencyId } });
    const passengers = await Passenger.count({where: { agencyId },
});

    // const payments = await Payment.sum("amount", { where: { agencyId } });

    res.json({
      trips,
      bookings,
      passengers,
    //   payments: payments || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err });
  }
};
