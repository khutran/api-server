'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("projects", [{
            name: 'lean.vicoders.com',
            category_id: 1,
            framework_id: 1,
            host_id: 1,
            status_id: 1,
            database: 'mysql',
            git_remote: 'https://khutx@bitbucket.org/vicoderscom/vicoders.git',
            git_branch: 'new_version',
            git_application_key	: 'khutx',
            git_application_secret: 'UGJ4nzhpdNQasDtPLsHU',
            created_at: new Date(),
            updated_at: new Date()
        }]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("users", null, {});
    }
};
