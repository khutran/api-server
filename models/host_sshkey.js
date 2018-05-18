'use strict';

module.exports = (sequelize, DataTypes) => {
  var Host_SshKey = sequelize.define(
    'host_sshkey',
    {
      host_id: DataTypes.INTEGER,
      ssh_key: DataTypes.TEXT
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );

  Host_SshKey.associate = models => {
    Host_SshKey.belongsTo(models.host);
  };

  return Host_SshKey;
};
