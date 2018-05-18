'use strict';

module.exports = (sequelize, DataTypes) => {
  var User_project = sequelize.define(
    'user_project',
    {
      user_id: DataTypes.INTEGER,
      project_id: DataTypes.INTEGER
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );

  // User_project.associate = models => {};

  return User_project;
};
