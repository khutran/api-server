'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("permissions", [{
                name: "Admin View",
                slug: "user.view",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "Admin Create",
                slug: "admin.create",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "Admin Update",
                slug: "admin.update",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "Admin Delete",
                slug: "admin.delete",
                created_at: new Date(),
                updated_at: new Date()
            }, {
                name: "User View",
                slug: "user.view",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "User Create",
                slug: "user.create",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "User Update",
                slug: "user.create",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "User View",
                slug: "user.view",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "Role Create",
                slug: "role.create",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "Role Update",
                slug: "role.update",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "Role View",
                slug: "role.view",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "Role Delete",
                slug: "role.delete",
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("permissions", null, {});
    }
};