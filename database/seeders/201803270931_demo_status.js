'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('status', [
      {
        name: 'deploy',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'stop',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'complate',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
