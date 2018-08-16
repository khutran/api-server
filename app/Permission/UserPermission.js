import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class UserPermission extends Permission {
  create() {
    this.permission.push(AvailablePermissions.CREATE_USER);
    return this;
  }

  update() {
    this.permission.push(AvailablePermissions.UPDATE_USER);
    return this;
  }

  get() {
    this.permission.push(AvailablePermissions.GET_USER);
    return this;
  }

  delete() {
    this.permission.push(AvailablePermissions.DELETE_USER);
    return this;
  }

  view() {
    this.permission.push(AvailablePermissions.VIEW_USER);
    return this;
  }
}
