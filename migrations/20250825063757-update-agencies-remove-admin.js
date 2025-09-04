// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add altering commands here.
//      *
//      * Example:
//      * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
//      */
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('users');
//      */
//   }
// };

// import { DataTypes } from "sequelize";

// /** @type {import('sequelize-cli').Migration} */
// export const up = async (queryInterface) => {
//   // Agencies se admin_id column hatao
//   await queryInterface.removeColumn("Agencies", "admin_id");
// };

// export const down = async (queryInterface) => {
//   // Rollback: wapis admin_id add karna
//   await queryInterface.addColumn("Agencies", "admin_id", {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     references: {
//       model: "Users",
//       key: "id",
//     },
//     onUpdate: "CASCADE",
//     onDelete: "SET NULL",
//   });
// };

"use strict";
import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Agencies se admin_id column hatao
    await queryInterface.removeColumn("Agencies", "admin_id");
  },

  async down(queryInterface, Sequelize) {
    // Rollback: wapis admin_id add karna
    await queryInterface.addColumn("Agencies", "admin_id", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },
};
