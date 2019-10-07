'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('OwnedStocks', [{
          tickerName: 'msft',
          numStocks: 300,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
      },
      {
          tickerName: 'aapl',
          numStocks: 1000,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('OwnedStocks', null, {});
  }
};
