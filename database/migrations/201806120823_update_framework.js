'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('framework', 'content_config', {
      type: Sequelize.JSON
    });
  },

  down: (queryInterface, Sequelize) => {
    // return queryInterface.dropTable('users');
  }
};
