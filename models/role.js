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
    }
  }

  Role.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING, // 👈 optional but useful
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles", // 👈 lowercase table name (matches migration)
    }
  );

  return Role;
};
