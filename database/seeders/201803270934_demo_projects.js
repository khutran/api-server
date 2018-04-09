'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("projects", [{
            name: 'lean.vicoders.com',
            categories: 'introduce',
            git: 'https://khutx@bitbucket.org/vicoderscom/lean_vicoders.git',
            framework: 'wordpress',
            host_id: 1,
            status_id: 1,
            created_at: new Date(),
            updated_at: new Date()
        }]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("users", null, {});
    }
};