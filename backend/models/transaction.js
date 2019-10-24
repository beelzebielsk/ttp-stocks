'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('transaction', {
    tickerName : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numStocks : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    /* Full price of the whole transaction */
    price : {
        type: DataTypes.DOUBLE,
        allowNull: false,
    }
  }, {});
  Transaction.associate = function(models) {
      models.transaction.belongsTo(models.user);
  };
  return Transaction;
};
