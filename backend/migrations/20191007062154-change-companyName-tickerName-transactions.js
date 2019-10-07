'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.renameColumn('Transactions', 'companyName', 'tickerName');
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.renameColumn('Transactions', 'tickerName', 'companyName');
  }
};
