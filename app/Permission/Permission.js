import { Auth } from '../Services/Facades/Auth';
import * as _ from 'lodash';
import { Exception } from '../Exceptions/Exception';

export default class Permission {
  constructor() {
    this.pass = false;
    this.permission = [];
  }

  async PermissionUser() {
    return new Promise(async resolve => {
      const role = await Auth.user().getRoles();
      let permission = [];
      _.forEach(role, item => {
        permission = _.concat(permission, item.permissions);
      });
      resolve(permission);
    });
  }

  async checkPermisson() {
    let arr = [];
    _.forEach(await this.PermissionUser(), item => {
      if (!_.isUndefined(_.find(this.permission, i => i === item.slug))) {
        arr.push(_.find(this.permission, i => i === item.slug));
      }
    });

    if (_.isEqual(this.permission.sort(), arr.sort())) {
      this.pass = true;
    }
    if (this.pass === false) {
      throw new Exception('Forbidden', 403);
    }
  }

  async checkView() {
    let arr = [];
    _.forEach(await this.PermissionUser(), item => {
      if (!_.isUndefined(_.find(this.permission, i => i === item.slug))) {
        arr.push(_.find(this.permission, i => i === item.slug));
      }
    });
    if (_.isEmpty(arr)) {
      return false;
    } else {
      return true;
    }
  }
}
