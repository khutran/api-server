'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("hosts", [{
                host_name: 'aaaaautopushsqlaa.vicoders.com',
                ip: '192.168.10.30',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {

    }
};