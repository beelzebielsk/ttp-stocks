'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      lastName: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      email: {
          type: Sequelize.STRING,
          allowNull: false,
          /* Email belongs to one account, not more */
          unique: true,
      },
      password: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      balance: {
          type: Sequelize.DOUBLE,
          allowNull: false,
          defaultValue: 5000,
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
