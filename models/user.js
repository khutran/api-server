import * as _ from 'lodash';
import models from '../models';

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
  };

  User.prototype.resetPasstoken = function(token = '') {
    this.resetPasswordToken = token;
  };

  User.prototype.can = async function(permission) {
    const roles = this.roles;
    if (!_.isUndefined(_.find(roles, item => item.isSuperAdmin()))) {
      return true;
    }
    let hasPermission = false;
    _.forEach(roles, item => {
      if (typeof item.permissions === 'string') {
        hasPermission = item.permissions.indexOf(permission) > -1;
      } else {
        if (_.includes(item.permissions, permission)) {
          hasPermission = true;
        }
      }
    });
    return hasPermission;
  };
  User.prototype.isRole = function(slug) {
    return new Promise((resolve, reject) => {
      this.getRoles({ where: { slug: slug } })
        .then(result => {
          if (!_.isNil(result) && !_.isUndefined(_.find(result, item => item.slug === slug))) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  User.prototype.notify = function(notification) {
    const _this = this;
    notification.setNotifiable(_this);
    notification.execute();
  };

  return User;
};
