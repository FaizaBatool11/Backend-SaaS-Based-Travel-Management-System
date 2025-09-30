import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      // ✅ Many-to-Many: Permission ↔ Role (through RolePermission)
      Permission.belongsToMany(models.Role, {
        through: models.RolePermission,   // pivot table
        foreignKey: "permissionId",
        otherKey: "roleId",
        as: "role"
      });
    }
  }

  Permission.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
    }
  );

  return Permission;
};
