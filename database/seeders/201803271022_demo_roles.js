'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        name: 'Super Admin',
        slug: 'superadmin',
        level: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'User',
        slug: 'user',
        level: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Admin',
        slug: 'admin',
        level: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
