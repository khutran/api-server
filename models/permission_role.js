'use strict';

module.exports = (sequelize, DataTypes) => {
  var Permission_role = sequelize.define(
    'permission_role',
    {
      role_id: DataTypes.INTEGER,
      permission_id: DataTypes.INTEGER
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );

  // User_project.associate = models => {};

  return Permission_role;
};
