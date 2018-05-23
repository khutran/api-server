'use strict';

module.exports = (sequelize, DataTypes) => {
  var Build = sequelize.define(
    'build',
    {
      project_id: DataTypes.INTEGER,
      host_id: DataTypes.INTEGER,
      database: DataTypes.TEXT,
      git: DataTypes.TEXT,
      git_branch: DataTypes.TEXT,
      git_key: DataTypes.TEXT,
      git_secret: DataTypes.TEXT,
      build_auto: DataTypes.BOOLEAN,
      backup: DataTypes.BOOLEAN,
      last_build: DataTypes.DATE
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );

  Build.associate = models => {
    Build.belongsTo(models.host);

    Build.addScope(
      'defaultScope',
      {
        include: [{ model: models.host }]
      },
      { override: true }
    );
  };

  return Build;
};
