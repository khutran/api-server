'use strict';

module.exports = (sequelize, DataTypes) => {
  var Permission = sequelize.define(
    'permission',
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING
    },
    {
      underscored: true
    }
  );

  return Permission;
};