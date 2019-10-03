'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    companyName : {
        type: Sequelize.STRING,
        allowNull: false,
    },
    numStocks : {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    /* Full price of the whole transaction */
    price : {
        type: Sequelize.DOUBLE,
        allowNull: false,
    }
  }, {});
  Transaction.associate = function(models) {
      models.Transaction.belongsTo(models.User);
  };
  return Transaction;
};
