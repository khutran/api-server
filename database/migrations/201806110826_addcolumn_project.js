'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          */
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
    /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
  }
};
