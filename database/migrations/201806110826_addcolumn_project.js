'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('projects', 'framework'),
      queryInterface.removeColumn('projects', 'categories'),
      queryInterface.addColumn('projects', 'framework_id', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('projects', 'category_id', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('projects', 'csdl_id', {
        type: Sequelize.INTEGER
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
