'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Markdowns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contentHTML: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      contentMarkdown: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      specialtyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      clinicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Markdowns');
  }
};