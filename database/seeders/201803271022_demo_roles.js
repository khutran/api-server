"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("roles", [{
                name: "Super Admin",
                slug: "superadmin",
                permissions: JSON.stringify([
                    "admin.view",
                    "admin.create",
                    "admin.update",
                    "admin.delete",
                ]),
                level: 1,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "User",
                slug: "user",
                level: 2,
                permissions: JSON.stringify([
                    "user.view",
                    "user.create",
                    "user.update",
                    "user.delete",
                ]),
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('roles', null, {});
    }
};