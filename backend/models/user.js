'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        /* Email belongs to one account, not more */
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    /* For a toy, this is too much and allows for imprecise amounts,
     * which I don't like. And if a user cannot sell stocks, then
     * they'll never have more than $5000 dollars, which makes this
     * overkill, and a worse choice than some sort of rational number
     * representation. */
    balance: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 5000,
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
      models.User.hasMany(models.Transaction);
      models.User.hasMany(models.OwnedStock);
  };
  return User;
};
