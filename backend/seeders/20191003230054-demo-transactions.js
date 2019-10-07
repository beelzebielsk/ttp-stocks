'use strict';

const start = new Date('January 1, 2019 00:00:00').valueOf();

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Transactions', [{
          tickerName: 'msft',
          numStocks: 100,
          price: 100,
          userId: 1,
          createdAt: new Date(start),
          updatedAt: new Date(start),
      },
      {
          tickerName: 'msft',
          numStocks: 200,
          price: 100,
          userId: 1,
          createdAt: new Date(start + 1000),
          updatedAt: new Date(start + 1000),
      },
      {
          tickerName: 'aapl',
          numStocks: 1000,
          price: 50,
          userId: 1,
          createdAt: new Date(start + 2000),
          updatedAt: new Date(start + 2000),
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Transactions', null, {});
  }
};
