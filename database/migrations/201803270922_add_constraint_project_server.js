"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return [
            queryInterface.addConstraint('projects', ['host_id'], {
                type: 'FOREIGN KEY',
                references: { //Required field
                    table: 'hosts',
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