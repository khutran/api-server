'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.createTable('permission_groups', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
          validate: {
            notEmpty: true
          }
        },
        slug: {
          allowNull: false,
          type: Sequelize.STRING,
          validate: {
            notEmpty: true
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
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('permission_groups');
  }
};
