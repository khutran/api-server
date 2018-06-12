'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('framework', [
      {
        name: 'wordpress',
        csdl: true,
        package_manager: 'composer',
        content_config: JSON.stringify({
          database: 'DB_NAME',
          user: 'DB_USER',
          password: 'DB_PASSWORD',
          host: 'DB_HOST'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'laravel',
        csdl: true,
        package_manager: 'composer',
        content_config: JSON.stringify({
          database: 'DB_DATABASE',
          user: 'DB_USERNAME',
          password: 'DB_PASSWORD',
          host: 'DB_HOST'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'nodejs',
        csdl: true,
        package_manager: 'yarn',
        content_config: JSON.stringify({
          database: 'DB_NAME',
          user: 'DB_USER',
          password: 'DB_PASS',
          host: 'DB_HOST'
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'angular4',
        csdl: false,
        package_manager: 'ng',
        content_config: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {}
};
