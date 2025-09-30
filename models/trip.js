import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Trip extends Model {
    static associate(models) {
      // 🔗 Trip → Agency (Many-to-One)
      Trip.belongsTo(models.Agency, {
        foreignKey: "agencyId",
        as: "agency",
      });

      Trip.hasMany(models.Booking, { foreignKey: "tripId" });

      // (Optional) 🔗 Trip → User (createdBy relation, agar migration me add kiya ho)
      // Trip.belongsTo(models.User, {
      //   foreignKey: "createdBy",
      //   as: "creator",
      // });
    }
  }

  Trip.init(
    {
      from: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      depart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      mode: {
        type: DataTypes.ENUM("Bus", "Train"),
        allowNull: false,
      },
      classType: {
        type: DataTypes.ENUM("Economy", "Business"),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seatsAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      agencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // (Optional)
      // createdBy: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      // },
    },
    {
      sequelize,
      modelName: "Trip",
      tableName: "Trips", // ✅ ensure table name consistency
    }
  );

  return Trip;
};
