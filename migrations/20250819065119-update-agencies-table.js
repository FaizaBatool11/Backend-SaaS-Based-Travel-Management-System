import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface) => {
  // naye columns add karo
  await queryInterface.addColumn("agencies", "email", {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  });

  await queryInterface.addColumn("agencies", "phone", {
    type: DataTypes.STRING,
    allowNull: false,
  });

  await queryInterface.addColumn("agencies", "address", {
    type: DataTypes.STRING,
    allowNull: false,
  });

  // contact_info ko permanently remove karna
  await queryInterface.removeColumn("agencies", "contact_info");
};

export const down = async (queryInterface) => {
  // sirf naye columns rollback karna
  await queryInterface.removeColumn("agencies", "email");
  await queryInterface.removeColumn("agencies", "phone");
  await queryInterface.removeColumn("agencies", "address");
};
