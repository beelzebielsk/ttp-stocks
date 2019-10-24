'use strict';
module.exports = (sequelize, DataTypes) => {
  const OwnedStock = sequelize.define('ownedStock', {
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
      models.ownedStock.belongsTo(models.user);
  };
  return OwnedStock;
};
