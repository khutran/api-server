'use strict';

module.exports = (sequelize, DataTypes) => {
  var Role = sequelize.define(
    'role',
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      level: DataTypes.INTEGER,
      description: DataTypes.TEXT
    },
    {
      underscored: true
      // freezeTableName: true
    }
  );

  Role.associate = models => {
    Role.belongsToMany(models.permissions, { through: 'permission_role' });

    Role.addScope(
      'defaultScope',
      {
        include: [{ model: models.permissions, through: 'permission_role' }]
      },
      { override: true }
    );
  };

  return Role;
};
