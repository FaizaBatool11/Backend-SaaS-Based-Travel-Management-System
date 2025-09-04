// import { Model, DataTypes } from "sequelize";

// export default (sequelize) => {
//   class User extends Model {
//     static associate(models) {
//       // User belongs to Agency
//       User.belongsTo(models.Agency, {
//         foreignKey: "agencyId",
//         as: "agency",
//         onDelete: "CASCADE",
//       });

//       // A user can have many trip requests (for agency_user)
//       User.hasMany(models.TripRequest, {
//         foreignKey: "userId",
//         as: "tripRequests",
//         onDelete: "CASCADE",
//       });
//     }
//   }

//   User.init(
//     {
//       name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },

//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//         validate: { isEmail: true },
//       },

//       password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },

//       role: {
//         type: DataTypes.ENUM("super_admin", "agency_admin", "agency_user"),
//         allowNull: false,
//       },

//       agencyId: {
//         type: DataTypes.INTEGER,
//         allowNull: true, // super_admin ke liye null hoga
//         references: {
//           model: "Agencies",
//           key: "id",
//         },
//       },
//     },
//     {
//       sequelize,
//       modelName: "User",
//       tableName: "Users",
//       timestamps: true,
//     }
//   );

//   return User;
// };

// import { Model, DataTypes } from "sequelize";

// export default (sequelize) => {
//   class User extends Model {
//     static associate(models) {
//       // User belongs to Agency
//       User.belongsTo(models.Agency, {
//         foreignKey: "agencyId",
//         as: "agency",
//         onDelete: "CASCADE",
//       });

//       // A user can have many trip requests (for agency_user)
//       // User.hasMany(models.TripRequest, {
//       //   foreignKey: "userId",
//       //   as: "tripRequests",
//       //   onDelete: "CASCADE",
//       // });
//     }
//   }

//   User.init(
//     {
//       name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },

//       email: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//         validate: { isEmail: true },
//       },

//       password: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },

//       role: {
//         type: DataTypes.ENUM("super_admin", "agency_admin", "agency_user"),
//         allowNull: false,
//       },

//       agencyId: {
//         type: DataTypes.INTEGER,
//         allowNull: true, // super_admin ke liye null hoga
//         // references ko temporarily hata diya
//       },
//     },
//     {
//       sequelize,
//       modelName: "User",
//       tableName: "Users",
//       timestamps: true,
//     }
//   );

//   return User;
// };

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

      role: {
        type: DataTypes.ENUM("super_admin", "agency_admin", "booking_agent"),
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
