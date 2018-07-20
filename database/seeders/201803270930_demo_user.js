'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        email: 'admin@vicoders.com',
        password: '$2a$08$KHJeGvYdcD0iCv4bkyLDh.lWrMZ1/ol3AXE9TAJUAq8OWiilR84cW',
        //password = secret
        first_name: 'Admin',
        last_name: 'Vicoders',
        last_login: new Date(),
        last_password_updated: new Date(),
        status: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'user@vicoders.com',
        password: '$2a$08$KHJeGvYdcD0iCv4bkyLDh.lWrMZ1/ol3AXE9TAJUAq8OWiilR84cW',
        //password = secret
        first_name: 'User',
        last_name: 'Vicoders',
        last_login: new Date(),
        last_password_updated: new Date(),
        status: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
