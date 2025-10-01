import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // ✅ Role <-> Permission (Many-to-Many)
      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        foreignKey: "roleId",
        otherKey: "permissionId",
        as: "permissions",
      });

      Role.hasMany(models.UserAgency, { foreignKey: "roleId" });
      // ✅ Role <-> Agency (Many-to-One)
      Role.belongsTo(models.Agency, { foreignKey: "agencyId", as: "agency" });
    }
  }
Role.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    agencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "roles",
    indexes: [
      {
        unique: true,
        fields: ["name", "agencyId"], // ✅ composite unique key
        name: "unique_role_per_agency"
      },
    ],
  }
);

  return Role;
};
