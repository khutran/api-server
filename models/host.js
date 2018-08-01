'use strict';

module.exports = (sequelize, DataTypes) => {
  var Host = sequelize.define(
    'host',
    {
      name: DataTypes.STRING,
      address_mysql: DataTypes.STRING,
      ip: DataTypes.TEXT
    },
    {
      underscored: true
    }
  );

  Host.associate = models => {
    Host.hasMany(models.project);
  };

  return Host;
};
