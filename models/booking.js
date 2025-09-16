// import { Model, DataTypes } from "sequelize";

// export default (sequelize) => {
//   class Booking extends Model {
//     static associate(models) {
//       // 🔗 Booking → Trip (Many-to-One)
//       Booking.belongsTo(models.Trip, {
//         foreignKey: "tripId",
//         as: "trip",
//         onUpdate: "CASCADE",
//         onDelete: "CASCADE",
//       });

//       // 🔗 Booking → Passenger (Many-to-One)
//       Booking.belongsTo(models.Passenger, {
//         foreignKey: "passengerId",
//         as: "passenger",
//         onUpdate: "CASCADE",
//         onDelete: "CASCADE",
//       });

//       // 🔗 Booking → User (createdBy) (Many-to-One)
//       Booking.belongsTo(models.User, {
//         foreignKey: "createdBy",
//         as: "creator",
//         onUpdate: "CASCADE",
//         onDelete: "SET NULL",
//       });
//     }
//   }

//   Booking.init(
//     {
//       tripId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       passengerId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       status: {
//         type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
//         allowNull: false,
//         defaultValue: "pending",
//       },
//       createdBy: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//       },
//     },
//     {
//       sequelize,
//       modelName: "Booking",
//       tableName: "bookings", // match your migration (lowercase)
//     }
//   );

//   return Booking;
// };

import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Booking extends Model {
    static associate(models) {
      // 🔗 Booking → Trip (Many-to-One)
      Booking.belongsTo(models.Trip, {
        foreignKey: "tripId",
        as: "trip",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      // 🔗 Booking → Passenger (Many-to-One)
      Booking.belongsTo(models.Passenger, {
        foreignKey: "passengerId",
        as: "passenger",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      // 🔗 Booking → User (createdBy) (Many-to-One)
      Booking.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "creator",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });

      // 🔗 Booking → Agency (Many-to-One)
      Booking.belongsTo(models.Agency, {
        foreignKey: "agencyId",
        as: "agency",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  }

  Booking.init(
    {
      tripId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      passengerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      agencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seatsAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Booking",
      tableName: "bookings", // match your migration (lowercase)
    }
  );

  return Booking;
};
