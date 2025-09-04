// 'use strict';
// import { DataTypes } from "sequelize";

// /** @type {import('sequelize-cli').Migration} */
// export default {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable("Trips", {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: DataTypes.INTEGER,
//       },
//       from: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       to: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       depart: {
//         type: DataTypes.DATE,
//         allowNull: false,
//       },
//       mode: {
//         type: DataTypes.ENUM("Bus", "Train"),
//         allowNull: false,
//       },
//       classType: {
//         type: DataTypes.ENUM("Economy", "Business"),
//         allowNull: false,
//       },
//       price: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       seatsAvailable: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       agencyId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//           model: "Agencies", // Agencies table ka name
//           key: "id",
//         },
//         onUpdate: "CASCADE",
//         onDelete: "CASCADE", // delete agency → related trips bhi delete
//       },
//       createdAt: {
//         allowNull: false,
//         type: DataTypes.DATE,
//         defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
//       },
//       updatedAt: {
//         allowNull: false,
//         type: DataTypes.DATE,
//         defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
//       },
//     });
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable("Trips");
//   },
// };

"use strict";
import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Trips", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
      // ✅ Foreign key relation with Agencies
      agencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Agencies", // must match table name of Agency
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // delete agency → delete its trips
      },
      // (Optional) Future: Agar aapko trip create karne wale user ka record rakhna ho
      // createdBy: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: "Users",
      //     key: "id",
      //   },
      //   onUpdate: "CASCADE",
      //   onDelete: "SET NULL",
      // },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Trips");
  },
};
