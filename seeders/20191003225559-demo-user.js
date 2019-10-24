'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', [{
          firstName: 'Mikey',
          lastName: 'Mike',
          email: 'mikeymike@funkybunch.com',
          password: bcrypt.hashSync('password', 10),
          createdAt: new Date(),
          updatedAt: new Date(),
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
  }
};
