'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('permissions', [
      {
        name: 'View User',
        slug: 'view.user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Create User',
        slug: 'create.user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Update User',
        slug: 'create.user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Delete User',
        slug: 'delete.user',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Create Role',
        slug: 'create.role',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Update Role',
        slug: 'update.role',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'View Role',
        slug: 'view.role',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Delete Role',
        slug: 'delete.role',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Create Service',
        slug: 'create.service',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Update Service',
        slug: 'update.service',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'View Service',
        slug: 'view.service',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Delete Service',
        slug: 'delete.service',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Create Application',
        slug: 'create.application',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Update Application',
        slug: 'update.application',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'View Application',
        slug: 'view.application',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Delete Application',
        slug: 'delete.application',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('permissions', null, {});
  }
};
