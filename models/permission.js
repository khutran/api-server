'use strict';

module.exports = (sequelize, DataTypes) => {
  var Permission = sequelize.define(
    'permissions',
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );

  // Permission.associate = models => {};

  return Permission;
};
