// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Passenger extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   Passenger.init({
//     name: DataTypes.STRING,
//     age: DataTypes.INTEGER,
//     phone: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Passenger',
//   });
//   return Passenger;
// };

import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Passenger extends Model {
    static associate(models) {
      // ✅ har Passenger ek Agency ka hoga
      Passenger.belongsTo(models.Agency, { foreignKey: "agencyId" });
    }
  }

  Passenger.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      agencyId: {   // ✅ foreign key for Agency
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Agencies", // Agencies table
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Passenger",
    }
  );

  return Passenger;
};


