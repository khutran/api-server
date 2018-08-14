'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
    let items = [];

    return queryInterface.bulkInsert('table_name', items);
    },

    down: (queryInterface, Sequelize) => {
    // return queryInterface.bulkDelete('table_name', null, {});
    }
};