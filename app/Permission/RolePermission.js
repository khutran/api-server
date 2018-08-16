import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class RolePermission extends Permission {
  create() {
    this.permission.push(AvailablePermissions.CREATE_ROLE);
    return this;
  }

  update() {
    this.permission.push(AvailablePermissions.UPDATE_ROLE);
    return this;
  }

  get() {
    this.permission.push(AvailablePermissions.GET_ROLE);
    return this;
  }

  delete() {
    this.permission.push(AvailablePermissions.DELETE_ROLE);
    return this;
  }

  view() {
    this.permission.push(AvailablePermissions.VIEW_ROLE);
    return this;
  }
}
