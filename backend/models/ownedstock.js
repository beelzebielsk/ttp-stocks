'use strict';
module.exports = (sequelize, DataTypes) => {
  const OwnedStock = sequelize.define('OwnedStock', {
    tickerName : {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numStocks : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  }, {});
  OwnedStock.associate = function(models) {
    // associations can be defined here
      models.OwnedStock.belongsTo(models.User);
  };
  return OwnedStock;
};
