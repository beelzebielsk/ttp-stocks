'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('OwnedStocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      companyName : {
          type: Sequelize.STRING,
          allowNull: false,
      },
      numStocks : {
          type: Sequelize.INTEGER,
          allowNull: false,
      },
      userId : {
          type: Sequelize.INTEGER,
          references: {
              model: 'Users',
              key: 'id'
          },
          allowNull: false,
          onUpdate: 'cascade',
          onDelete: 'set null',
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
    return queryInterface.dropTable('OwnedStocks');
  }
};
