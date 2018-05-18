'use strict';

module.exports = (sequelize, DataTypes) => {
  var Status = sequelize.define(
    'status',
    {
      name: DataTypes.STRING
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );

  Status.associate = models => {
    Status.hasMany(models.project);
  };

  return Status;
};
