'use strict';

module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define(
    'category',
    {
      name: DataTypes.STRING
    },
    {
      underscored: true,
      // freezeTableName: true,
      tableName: 'categories'
    }
  );

  // Csdl.associate = models => {

  // };

  return Category;
};
