'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .transaction(function handleTransaction(t) {
        return Promise.all([
          queryInterface.addColumn('projects', 'host_id', {
            type: Sequelize.INTEGER,
            validate: {
              notEmpty: true
            }
          }),
          queryInterface.addColumn('projects', 'database', {
            type: Sequelize.STRING,
            validate: {
              notEmpty: true
            }
          }),
          queryInterface.addColumn('projects', 'git_remote', {
            type: Sequelize.STRING,
            validate: {
              notEmpty: true
            }
          }),
          queryInterface.addColumn('projects', 'git_branch', {
            type: Sequelize.STRING,
            validate: {
              notEmpty: true
            }
          }),
          queryInterface.addColumn('projects', 'git_application_key', {
            type: Sequelize.STRING,
            validate: {
              notEmpty: true
            }
          }),
          queryInterface.addColumn('projects', 'git_application_secret', {
            type: Sequelize.STRING,
            validate: {
              notEmpty: true
            }
          }),
          queryInterface.addColumn('projects', 'build_automatically', {
            type: Sequelize.BOOLEAN,
            validate: {
              notEmpty: true
            }
          }),
          queryInterface.addColumn('projects', 'backup', {
            type: Sequelize.BOOLEAN,
            validate: {
              notEmpty: true
            }
          })
        ]);
      })
      .then(function() {
        return queryInterface.sequelize.transaction(function handleTransaction(t) {
          return Promise.all([
            queryInterface.addConstraint('projects', ['host_id'], {
              type: 'FOREIGN KEY',
              references: {
                table: 'hosts',
                field: 'id'
              },
              onDelete: 'SET NULL',
              onUpdate: 'cascade'
            })
          ]);
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([
        queryInterface.removeColumn('projects', 'host_id'),
        queryInterface.removeColumn('projects', 'database'),
        queryInterface.removeColumn('projects', 'git_remote'),
        queryInterface.removeColumn('projects', 'git_branch'),
        queryInterface.removeColumn('projects', 'git_application_key'),
        queryInterface.removeColumn('projects', 'git_application_secret'),
        queryInterface.removeColumn('projects', 'build_automatically'),
        queryInterface.removeColumn('projects', 'backup')
      ]);
    });
  }
};
