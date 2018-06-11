'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('csdl', [
      {
        name: 'mysql',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'mongodb',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'postgresql',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {

  }
};
