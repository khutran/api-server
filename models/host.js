'use strict';

module.exports = (sequelize, DataTypes) => {
  var Hosts = sequelize.define(
    'host',
    {
      name: DataTypes.STRING,
      ip: DataTypes.TEXT
    },
    {
      underscored: true
      // freezeTableName: true
    }
  );

  Hosts.associate = models => {
    Hosts.hasMany(models.host_sshkey);
  };

  return Hosts;
};
