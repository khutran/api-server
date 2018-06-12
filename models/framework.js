'use strict';

module.exports = (sequelize, DataTypes) => {
  var Framework = sequelize.define(
    'framework',
    {
      name: DataTypes.STRING,
      csdl: DataTypes.BOOLEAN,
      package_manager : DataTypes.STRING,
      content_config: DataTypes.JSON
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );

  // Framework.associate = models => {

  // };

  return Framework;
};
