'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("projects", [{
            name: 'lean.vicoders.com',
            categories: 'introduce',
            framework: 'wordpress',
            status_id: 1,
            created_at: new Date(),
            updated_at: new Date()
        }]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("users", null, {});
    }
};
