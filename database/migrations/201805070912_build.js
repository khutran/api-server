'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('build', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true
        }
      },
      host_id: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true
        }
      },
      database: {
        type: Sequelize.TEXT,
        validate: {
          notEmpty: true
        }
      },
      git: {
        type: Sequelize.TEXT,
        validate: {
          notEmpty: true
        }
      },
      git_branch: {
        type: Sequelize.TEXT,
        validate: {
          notEmpty: true
        }
      },
      git_key: {
        type: Sequelize.TEXT,
        validate: {
          notEmpty: true
        }
      },
      git_secret: {
        type: Sequelize.TEXT,
        validate: {
          notEmpty: true
        }
      },
      build_auto: {
        type: Sequelize.BOOLEAN,
        validate: {
          notEmpty: true
        }
      },
      backup: {
        type: Sequelize.BOOLEAN,
        validate: {
          notEmpty: true
        }
      },
      last_build: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('build');
  }
};
