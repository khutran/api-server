'use strict';

module.exports = (sequelize, DataTypes) => {
  var Project = sequelize.define(
    'project',
    {
      name: DataTypes.STRING,
      database: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      category_id: DataTypes.INTEGER,
      framework_id: DataTypes.INTEGER,
      csdl_id: DataTypes.INTEGER,
      status_id: DataTypes.INTEGER,
      git_remote: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      git_branch: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      git_application_key: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      git_application_secret: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      build_automatically: {
        type: DataTypes.BOOLEAN,
        validate: {
          notEmpty: true
        }
      },
      backup: {
        type: DataTypes.BOOLEAN,
        validate: {
          notEmpty: true
        }
      },
      build_time: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      underscored: true
      // freezeTableName: true
    }
  );

  Project.associate = models => {
    Project.belongsTo(models.status);
    Project.belongsTo(models.host);
    Project.belongsTo(models.framework);
    Project.belongsTo(models.csdl);
    Project.hasOne(models.build);
    Project.belongsTo(models.category, { as: 'categories', foreignKey: 'category_id' });
    Project.belongsToMany(models.user, { through: 'user_project' });

    Project.addScope(
      'listUser-Scope',
      {
        include: [{ model: models.user, through: 'user_project' }]
      },
      { override: true }
    );

    Project.addScope(
      'defaultScope',
      {
        include: [{ model: models.status }, { model: models.host }, { model: models.framework }, { model: models.csdl }, { model: models.category, as: 'categories' }]
      },
      { override: true }
    );
  };

  return Project;
};
