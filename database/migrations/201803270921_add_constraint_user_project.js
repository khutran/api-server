'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addConstraint('user_project', ['user_id'], {
        type: 'FOREIGN KEY',
        references: {
          //Required field
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
      queryInterface.addConstraint('user_project', ['project_id'], {
        type: 'FOREIGN KEY',
        references: {
          //Required field
          table: 'projects',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    ];
  },

  down: (queryInterface, Sequelize) => {}
};
