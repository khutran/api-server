'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("status", [{
            name: 'pending',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            name: 'stop',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            name: 'finish',
            created_at: new Date(),
            updated_at: new Date()
        }]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("users", null, {});
    }
};