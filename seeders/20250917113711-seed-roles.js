'use strict';

export async function up(queryInterface, Sequelize) {
  const now = new Date();
  await queryInterface.bulkInsert('roles', [
    { name: 'owner', description: 'Agency owner', createdAt: now, updatedAt: now },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('roles', null, {});
}
