// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Booking extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Booking.init({
//     tripId: DataTypes.INTEGER,
//     passengerId: DataTypes.INTEGER,
//     status: DataTypes.STRING,
//     createdBy: DataTypes.INTEGER
//   }, {
//     sequelize,
//     modelName: 'Booking',
//   });
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
