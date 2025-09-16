'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('Users', 'role', {
    type: Sequelize.ENUM('owner', 'manager', 'booking-agent'),
    allowNull: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('Users', 'role', {
    type: Sequelize.STRING,
    allowNull: false,
  });
}
