'use strict';

module.exports = (sequelize, DataTypes) => {
  var User_role = sequelize.define(
    'user_role',
    {
      user_id: DataTypes.INTEGER,
      role_id: DataTypes.INTEGER
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );

  // User_role.associate = models => {};

  return User_role;
};
