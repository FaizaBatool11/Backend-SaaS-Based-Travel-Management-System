
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class UserAgency extends Model {
    static associate(models) {
      // Many-to-Many relation: User ↔ Agency
      UserAgency.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      UserAgency.belongsTo(models.Agency, { foreignKey: 'agencyId', as: 'agency' });
      UserAgency.belongsTo(models.Role, { foreignKey: "roleId", as: 'role' });   
    }
  }

  UserAgency.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      agencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Agencies',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    },
    {
      sequelize,
      modelName: 'UserAgency',
      tableName: 'UserAgencies',
      timestamps: true,
    }
  );

  return UserAgency;
};
