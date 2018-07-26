'use strict';

module.exports = (sequelize, DataTypes) => {
  var Project = sequelize.define(
    'project',
    {
      name: DataTypes.STRING,
      category_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      framework_id: {
        type: DataTypes.INTEGER
      },
      csdl_id: {
        type: DataTypes.INTEGER
      },
      status_id: {
        type: DataTypes.INTEGER
      },
      host_id: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: true
        }
      },
      database: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
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
      }
    },
    {
      underscored: true
      // freezeTableName: true
    }
  );

  Project.associate = models => {
    Project.belongsTo(models.status);
    Project.hasOne(models.build);
    Project.belongsTo(models.host);
    Project.belongsTo(models.framework);
    Project.belongsTo(models.csdl);
    Project.belongsTo(models.category, { as: 'categories', foreignKey: 'category_id' });

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
