'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.addColumn('permissions', 'group_id', {
          type: Sequelize.INTEGER,
          after: 'slug'
        })
      ]).then(function() {
        queryInterface.addConstraint('permissions', ['group_id'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'permission_groups',
            field: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'SET NULL'
        });
      });
    });
  },

  down: (queryInterface, Sequelize) => {
    return [queryInterface.removeColumn('permissions', 'group_id')];
  }
};
