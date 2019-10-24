'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction(async (transaction) => {
          return await Promise.all([
              queryInterface.renameTable('Users', 'users', {transaction}),
              queryInterface.renameTable('OwnedStocks', 'ownedStocks', {transaction}),
              queryInterface.renameTable('Transactions', 'transactions', {transaction}),
          ]);
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.sequelize.transaction(async (transaction) => {
          return await Promise.all([
              queryInterface.renameTable('users', 'Users', {transaction}),
              queryInterface.renameTable('ownedStocks', 'OwnedStocks', {transaction}),
              queryInterface.renameTable('transactions', 'Transactions', {transaction}),
          ]);
      });
  }
};
