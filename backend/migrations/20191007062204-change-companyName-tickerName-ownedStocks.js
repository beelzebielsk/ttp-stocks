'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.renameColumn('OwnedStocks', 'companyName', 'tickerName');
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.renameColumn('OwnedStocks', 'tickerName', 'companyName');
  }
};
