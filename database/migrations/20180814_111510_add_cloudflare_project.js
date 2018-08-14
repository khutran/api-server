'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .transaction(function handleTransaction(t) {
        return Promise.all([
          queryInterface.addColumn('projects', 'cloudflare', {
            type: Sequelize.BOOLEAN,
            validate: {
              notEmpty: true
            }
          })
        ]);
      })
      .then(function() {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(function handleTransaction(t) {
      return Promise.all([queryInterface.removeColumn('projects', 'cloudflare')]);
    });
  }
};
