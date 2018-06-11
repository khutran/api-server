'use strict';

module.exports = (sequelize, DataTypes) => {
  var Project = sequelize.define(
    'project',
    {
      name: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      framework_id: DataTypes.INTEGER,
      csdl_id: DataTypes.INTEGER,
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
    Project.belongsTo(models.framework);
    Project.belongsTo(models.csdl);
    Project.belongsTo(models.categories, { foreignKey: 'category_id' });

    Project.addScope(
      'defaultScope',
      {
        include: [{ model: models.status }, { model: models.build }, { model: models.framework }, { model: models.csdl }, { model: models.categories }]
      },
      { override: true }
    );
  };

  return Project;
};
