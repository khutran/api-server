'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          */
    return queryInterface.createTable('hosts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        unique: 'compositeIndex',
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true,
          len: [1, 255]
        }
      },
      ip: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      address_mysql: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true,
          len: [1, 255]
        }
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
    /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
  }
};
