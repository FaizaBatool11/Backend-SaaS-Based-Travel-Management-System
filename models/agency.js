import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Agency extends Model {
    static associate(models) {
      // Many-to-Many relation with Users
      Agency.belongsToMany(models.User, {
        through: models.UserAgency,   // pivot table ka naam
        foreignKey: "agencyId",
        otherKey: "userId",
        as: "users",
      });

      // One-to-Many relation with Trips
      Agency.hasMany(models.Trip, {
        foreignKey: "agencyId",
        as: "trips",
        onDelete: "CASCADE",
      });

      Agency.hasMany(models.UserAgency, { foreignKey: "agencyId" });
    }
  }

  Agency.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // email: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      //   // unique: true,
      // },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // ❌ admin_id column ko hata do kyunki pivot table handle karega
    },
    {
      sequelize,
      modelName: "Agency",
      tableName: "Agencies",
      timestamps: true,
    }
  );

  return Agency;
};
