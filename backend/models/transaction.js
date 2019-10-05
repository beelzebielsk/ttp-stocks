'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    companyName : {
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
      models.Transaction.belongsTo(models.User);
  };
  return Transaction;
};
