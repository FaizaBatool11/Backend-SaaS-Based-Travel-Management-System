import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      // ✅ Many-to-Many relation: User <-> Agency (through UserAgencies)
      User.belongsToMany(models.Agency, {
        through: models.UserAgency, // Pivot table
        foreignKey: "userId",
        otherKey: "agencyId",
        as: "agencies",
      });
      User.hasMany(models.UserAgency, { foreignKey: "userId" });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    }
  );

  return User;
};
