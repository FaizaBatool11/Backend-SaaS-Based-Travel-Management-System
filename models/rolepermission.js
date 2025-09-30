import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class RolePermission extends Model {
    static associate(models) {
      // Optional explicit associations (not required if using belongsToMany in Role & Permission)
      RolePermission.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      });

      RolePermission.belongsTo(models.Permission, {
        foreignKey: "permissionId",
        as: "permission",
      });

      models.Role.hasMany(models.RolePermission, { foreignKey: "roleId" });
      models.Permission.hasMany(models.RolePermission, { foreignKey: "permissionId" });
    }
  }

  RolePermission.init(
    {
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "rolepermissions", // ✅ ensures correct table name
    }
  );

  return RolePermission;
};
