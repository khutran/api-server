"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.addConstraint('projects', ['status_id'], {
                type: 'FOREIGN KEY',
                references: { //Required field
                    table: 'status',
                    field: 'id'
                },
                onDelete: 'SET NULL',
                onUpdate: 'cascade'
            }),
        ]
    },

    down: (queryInterface, Sequelize) => {

    }
};