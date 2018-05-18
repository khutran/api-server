'use strict';
import * as _ from 'lodash';
import bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    'user',
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.INTEGER,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      last_login: DataTypes.STRING,
      last_password_updated: DataTypes.STRING
    },
    {
      underscored: true
      // freezeTableName: true
    }
  );

  User.associate = models => {
    User.belongsToMany(models.role, { through: 'role_user' });
    User.belongsToMany(models.project, { through: 'user_project' });

    User.addScope(
      'scopeRole-Project',
      {
        include: [{ model: models.role }]
      },
      { override: true }
    );

    User.addHook('beforeCreate', 'generateHashPassword', (user, options) => {
      user['password'] = bcrypt.hashSync(user.get('password'), bcrypt.genSaltSync(8), null);
      return user;
    });

    User.addHook('beforeUpdate', 'generateHashPassword', async (user, options) => {
      if (_.indexOf(options['fields'], 'password') > -1) {
        user['password'] = bcrypt.hashSync(user.get('password'), bcrypt.genSaltSync(8), null);
      }
      return user;
    });
  };

  User.prototype.resetPasstoken = function(token = '') {
    this.resetPasswordToken = token;
  };

  // User.prototype.resetEmailtoken = function(token = "") {
  //     this.resetEmailToken = token;
  //     return this;
  // };

  // User.prototype.can = function(permission) {
  //     return new Promise((resolve, reject) => {
  //         _.forEach(this.roles, (val) => {
  //             if (val['id'] === 1) {
  //                 resolve(true);
  //             }
  //         });

  //         _.forEach(this.roles, (item) => {
  //             if (item.permissions.indexOf(permission) > -1) {
  //                 resolve(true);
  //             }
  //         });
  //         reject({ message: "Permission denied", error_code: 500 });
  //     })
  // };

  // User.prototype.isRole = function(id) {
  //     return new Promise((resolve, reject) => {
  //         models.role_user.findOne({
  //                 where: { user_id: this.id, role_id: id }
  //             })
  //             .then(results => {
  //                 if (!results) {
  //                     reject(false);
  //                 } else {
  //                     resolve(true);
  //                 }
  //             });
  //     });
  // };

  // User.prototype.notify = function(notification) {
  //     let _this = this;
  //     notification.setNotifiable(_this);
  //     notification.execute();
  // };

  return User;
};
