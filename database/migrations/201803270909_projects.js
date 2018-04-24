"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          */
        return queryInterface.createTable("projects", {
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
            host_id: {
                type: Sequelize.INTEGER,
            },
            branch: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            categories: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            git: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            framework: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            status_id: {
                type: Sequelize.INTEGER,
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