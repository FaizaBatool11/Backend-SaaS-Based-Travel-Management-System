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

'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'agencyId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'agencyId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Agencies',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};
