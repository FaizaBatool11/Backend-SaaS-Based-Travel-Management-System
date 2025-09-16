// 'use strict';
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up(queryInterface, Sequelize) {
//     await queryInterface.createTable('Bookings', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       tripId: {
//         type: Sequelize.INTEGER
//       },
//       passengerId: {
//         type: Sequelize.INTEGER
//       },
//       status: {
//         type: Sequelize.STRING
//       },
//       createdBy: {
//         type: Sequelize.INTEGER
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE
//       }
//     });
//   },
//   async down(queryInterface, Sequelize) {
//     await queryInterface.dropTable('Bookings');
//   }
// };

'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', { // table name lowercase
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tripId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'trips', // lowercase table name
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      passengerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'passengers', // lowercase table name
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      agencyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'agencies', // lowercase table name
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      seatsAvailable: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending'
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users', // lowercase table name
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookings');
  }
};

