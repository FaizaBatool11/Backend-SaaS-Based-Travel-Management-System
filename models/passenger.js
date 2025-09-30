import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Passenger extends Model {
    static associate(models) {
      // ✅ har Passenger ek Agency ka hoga
      Passenger.belongsTo(models.Agency, { foreignKey: "agencyId" });
      Passenger.hasMany(models.Booking, { foreignKey: "passengerId" });

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


