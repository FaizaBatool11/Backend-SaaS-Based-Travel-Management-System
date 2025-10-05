// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// export default {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('roles', {   // ✅ lowercase table name
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER,
//       },
//       name: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true,
//       },
//       description: {
//         type: Sequelize.STRING,
//         allowNull: true,
//       },
//       agencyId: {
//         type: Sequelize.INTEGER,
//         allowNull: true,
//         references: { model: 'Agencies', key: 'id' }, // FK to Agencies
//         onDelete: 'CASCADE',
//         onUpdate: 'CASCADE',
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
//       },
//     });
//   },

//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('roles');  // ✅ lowercase
//   },
// };

'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {   // ✅ lowercase table name
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      agencyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Agencies', key: 'id' }, // FK to Agencies
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // ✅ Add composite unique constraint here
    await queryInterface.addConstraint('roles', {
      fields: ['name', 'agencyId'],
      type: 'unique',
      name: 'unique_role_per_agency',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove constraint first (important for rollback)
    await queryInterface.removeConstraint('roles', 'unique_role_per_agency');
    await queryInterface.dropTable('roles');
  },
};
