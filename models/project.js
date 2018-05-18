'use strict';

module.exports = (sequelize, DataTypes) => {
  var Project = sequelize.define(
    'project',
    {
      name: DataTypes.STRING,
      categories: DataTypes.TEXT,
      framework: DataTypes.TEXT,
      status_id: DataTypes.INTEGER
    },
    {
      underscored: true
      // freezeTableName: true
    }
  );

  Project.associate = models => {
    Project.belongsTo(models.status);
    Project.hasOne(models.build);

    Project.addScope(
      'defaultScope',
      {
        include: [{ model: models.status }, { model: models.build }]
      },
      { override: true }
    );
  };

  return Project;
};
