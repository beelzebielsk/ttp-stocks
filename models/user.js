'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        /* Email belongs to one account, not more */
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /* For a toy, this is too much and allows for imprecise amounts,
     * which I don't like. And if a user cannot sell stocks, then
     * they'll never have more than $5000 dollars, which makes this
     * overkill, and a worse choice than some sort of rational number
     * representation. */
    balance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 5000,
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
      models.user.hasMany(models.transaction);
      models.user.hasMany(models.ownedStock);
  };
  return User;
};
