import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class PermissionPermission extends Permission {
  create() {
    this.permission.push(AvailablePermissions.CRATE_PERMISSIONE);
    return this;
  }

  update() {
    this.permission.push(AvailablePermissions.UPDATE_PERMISSION);
    return this;
  }

  get() {
    this.permission.push(AvailablePermissions.GET_PERMISSION);
    return this;
  }

  delete() {
    this.permission.push(AvailablePermissions.DELETE_PERMISSION);
    return this;
  }

  view() {
    this.permission.push(AvailablePermissions.VIEW_PERMISSION);
    return this;
  }
}
