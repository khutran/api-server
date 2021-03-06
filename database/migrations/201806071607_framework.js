'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          */
    return queryInterface.createTable('framework', {
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
      csdl: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      package_manager: {
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
    return queryInterface.dropTable('framework');
  }
};
