'use strict';
import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserAgencies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }, // FK to Users
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      agencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Agencies', key: 'id' }, // FK to Agencies
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // unique constraint to avoid duplicate entries
    await queryInterface.addConstraint('UserAgencies', {
      fields: ['userId', 'agencyId'],
      type: 'unique',
      name: 'uniq_user_agency_pair',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserAgencies');
  },
};