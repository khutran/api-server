'use strict';

module.exports = (sequelize, DataTypes) => {
  var Role = sequelize.define(
    'role',
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      level: DataTypes.INTEGER,
      permissions: DataTypes.JSON,
      description: DataTypes.TEXT
    },
    {
      underscored: true
      // freezeTableName: true
    }
  );

  // Role.associate = models => {};

  return Role;
};
