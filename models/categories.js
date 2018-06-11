'use strict';

module.exports = (sequelize, DataTypes) => {
  var Categories = sequelize.define(
    'categories',
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

  return Categories;
};
