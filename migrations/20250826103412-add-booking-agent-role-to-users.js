'use strict';
import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Remove 'agency_user' and keep only three roles
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('super_admin', 'agency_admin', 'booking_agent'),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: Add 'agency_user' back
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('super_admin', 'agency_admin', 'agency_user', 'booking_agent'),
      allowNull: false,
    });
  },
};
