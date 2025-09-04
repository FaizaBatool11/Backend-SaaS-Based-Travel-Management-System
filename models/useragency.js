// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class UserAgency extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   UserAgency.init({
//     userId: DataTypes.INTEGER,
//     agencyId: DataTypes.INTEGER,
//     role: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'UserAgency',
//   });
//   return UserAgency;
// };

import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class UserAgency extends Model {
    static associate(models) {
      // Many-to-Many relation: User ↔ Agency
      UserAgency.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      UserAgency.belongsTo(models.Agency, { foreignKey: 'agencyId', as: 'agency' });
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
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'owner',
      },
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
