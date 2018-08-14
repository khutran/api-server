'use strict';

module.exports = (sequelize, DataTypes) => {
  var PermissionGroup = sequelize.define(
    'PermissionGroup',
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING
    },
    {
      underscored: true,
      tableName: 'permission_groups'
    }
  );

  PermissionGroup.associate = models => {
    PermissionGroup.hasMany(models.permissions, { foreignKey: 'group_id' });
  };

  return PermissionGroup;
};
