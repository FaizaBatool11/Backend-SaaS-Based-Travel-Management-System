'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Add composite unique constraint
    await queryInterface.addConstraint('roles', {
      fields: ['name', 'agencyId'],
      type: 'unique',
      name: 'unique_role_per_agency'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the constraint if rolling back
    await queryInterface.removeConstraint('roles', 'unique_role_per_agency');
  }
};
