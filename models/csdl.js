'use strict';

module.exports = (sequelize, DataTypes) => {
  var Csdl = sequelize.define(
    'csdl',
    {
      name: DataTypes.STRING
    },
    {
      underscored: true,
      freezeTableName: true
    }
  );

  // Csdl.associate = models => {

  // };

  return Csdl;
};
