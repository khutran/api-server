import * as _ from 'lodash';
import bcrypt from 'bcrypt-nodejs';
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

    User.addHook('beforeCreate', 'generateHashPassword', user => {
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

  User.prototype.can = async function(permission) {
    const roles = this.roles;
    if (!_.isUndefined(_.find(roles, item => item.isSuperAdmin()))) {
      return true;
    }
    let hasPermission = false;
    _.forEach(roles, item => {
      console.log(item);
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
      models.user
        .findOne({
          where: { id: this.id },
          include: { model: models.role, where: { slug: slug } }
        })
        .then(result => {
          if (!_.isNil(result)) {
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
