'use strict';

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  // Get roles
  const [roles] = await queryInterface.sequelize.query(
    `SELECT id, name FROM roles WHERE name IN ('owner');`
  );
  const roleMap = Object.fromEntries(roles.map(r => [r.name, r.id]));

  // Get permissions
  const [perms] = await queryInterface.sequelize.query(
    `SELECT id, name FROM permissions;`
  );
  const permMap = Object.fromEntries(perms.map(p => [p.name, p.id]));

  const rows = [];

  // Owner: all permissions
  Object.values(permMap).forEach(permissionId => {
    rows.push({ roleId: roleMap['owner'], permissionId, createdAt: now, updatedAt: now });
  });

  if (rows.length > 0) {
    await queryInterface.bulkInsert('rolepermissions', rows);
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('rolepermissions', null, {});
}
