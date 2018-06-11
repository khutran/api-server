'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('framework', [
      {
        name: 'wordpress',
        csdl: true,
        package_manager: 'composer',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'laravel',
        csdl: true,
        package_manager: 'composer',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'nodejs',
        csdl: true,
        package_manager: 'yarn',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'angular4',
        csdl: false,
        package_manager: 'ng',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {

  }
};
