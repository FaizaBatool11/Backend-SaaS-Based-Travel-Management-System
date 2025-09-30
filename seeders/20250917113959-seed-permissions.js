// 'use strict';

// export async function up(queryInterface, Sequelize) {
//   const now = new Date();
//   await queryInterface.bulkInsert('permissions', [
//     { name: 'agencies:create',   description: 'Create agencies',   createdAt: now, updatedAt: now },
//     { name: 'users:create',      description: 'Create users',      createdAt: now, updatedAt: now },
//     { name: 'trips:create',      description: 'Create trips',      createdAt: now, updatedAt: now },
//     { name: 'trips:read',        description: 'Read trips',        createdAt: now, updatedAt: now },
//     { name: 'trips:update',      description: 'Update trips',      createdAt: now, updatedAt: now },
//     { name: 'trips:delete',      description: 'Delete trips',      createdAt: now, updatedAt: now },
//     { name: 'bookings:create',   description: 'Create bookings',   createdAt: now, updatedAt: now },
//     { name: 'bookings:read',     description: 'Read bookings',     createdAt: now, updatedAt: now },
//     { name: 'bookings:update',   description: 'Update bookings',   createdAt: now, updatedAt: now },
//     { name: 'bookings:delete',   description: 'Delete bookings',   createdAt: now, updatedAt: now },
//     { name: 'passengers:create', description: 'Create passengers', createdAt: now, updatedAt: now },
//     { name: 'passengers:read',   description: 'Read passengers',   createdAt: now, updatedAt: now },
//     { name: 'passengers:update', description: 'Update passengers', createdAt: now, updatedAt: now },
//     { name: 'passengers:delete', description: 'Delete passengers', createdAt: now, updatedAt: now },

//     // ✅ New permissions
//     { name: 'users:manage',      description: 'Manage users (CRUD + assign roles)', createdAt: now, updatedAt: now },
//     { name: 'users:read',        description: 'Read user list and details',        createdAt: now, updatedAt: now },
//     { name: 'stats:view',        description: 'View agency statistics',            createdAt: now, updatedAt: now },
//   ]);
// }

// export async function down(queryInterface, Sequelize) {
//   await queryInterface.bulkDelete('permissions', {
//     name: [
//       'agencies:create',
//       'users:create',
//       'trips:create', 'trips:read', 'trips:update', 'trips:delete',
//       'bookings:create', 'bookings:read', 'bookings:update', 'bookings:delete',
//       'passengers:create', 'passengers:read', 'passengers:update', 'passengers:delete',
//       'users:manage', 'users:read', 'stats:view'   // ✅ also remove new ones
//     ]
//   }, {});
// }

"use strict";

export async function up(queryInterface, Sequelize) {
  const now = new Date();

  await queryInterface.bulkInsert("permissions", [
    // Agencies
    { name: "agencies:create", description: "Create agencies", createdAt: now, updatedAt: now },
    { name: "agencies:view", description: "View agencies", createdAt: now, updatedAt: now },
    // { name: "agencies:update", description: "Update agencies", createdAt: now, updatedAt: now },
    // { name: "agencies:delete", description: "Delete agencies", createdAt: now, updatedAt: now },

    // Users
    { name: "users:create", description: "Create users", createdAt: now, updatedAt: now },
    { name: "users:read", description: "Read users", createdAt: now, updatedAt: now },
    { name: "users:update", description: "Update users", createdAt: now, updatedAt: now },
    { name: "users:delete", description: "Delete users", createdAt: now, updatedAt: now },

    // Roles
    { name: "roles:create", description: "Create roles", createdAt: now, updatedAt: now },
    { name: "roles:view", description: "View roles", createdAt: now, updatedAt: now },
    { name: "roles:update", description: "Update roles", createdAt: now, updatedAt: now },
    { name: "roles:delete", description: "Delete roles", createdAt: now, updatedAt: now },

    // Trips
    { name: "trips:create", description: "Create trips", createdAt: now, updatedAt: now },
    { name: "trips:read", description: "Read trips", createdAt: now, updatedAt: now },
    { name: "trips:update", description: "Update trips", createdAt: now, updatedAt: now },
    { name: "trips:delete", description: "Delete trips", createdAt: now, updatedAt: now },

    // Bookings
    { name: "bookings:create", description: "Create bookings", createdAt: now, updatedAt: now },
    { name: "bookings:read", description: "Read bookings", createdAt: now, updatedAt: now },
    { name: "bookings:update", description: "Update bookings", createdAt: now, updatedAt: now },
    { name: "bookings:cancel", description: "Cancel bookings", createdAt: now, updatedAt: now },

    // Passengers
    { name: "passengers:create", description: "Create passengers", createdAt: now, updatedAt: now },
    { name: "passengers:read", description: "Read passengers", createdAt: now, updatedAt: now },
    { name: "passengers:update", description: "Update passengers", createdAt: now, updatedAt: now },
    { name: "passengers:delete", description: "Delete passengers", createdAt: now, updatedAt: now },

    // Stats
    { name: "stats:view", description: "View agency statistics", createdAt: now, updatedAt: now },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete(
    "permissions",
    {
      name: [
        "agencies:create", "agencies:view",
        "users:create", "users:read", "users:update", "users:delete",
        "roles:create", "roles:view", "roles:update", "roles:delete",
        "trips:create", "trips:read", "trips:update", "trips:delete",
        "bookings:create", "bookings:read", "bookings:update", "bookings:cancel",
        "passengers:create", "passengers:read", "passengers:update", "passengers:delete",
        "stats:view",
      ],
    },
    {}
  );
}
