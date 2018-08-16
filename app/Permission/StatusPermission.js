import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class StatusPermission extends Permission {
  create() {
    this.permission.push(AvailablePermissions.CREATE_SERVICE);
    return this;
  }

  update() {
    this.permission.push(AvailablePermissions.UPDATE_SERVICE);
    return this;
  }

  get() {
    this.permission.push(AvailablePermissions.GET_SERVICE);
    return this;
  }

  delete() {
    this.permission.push(AvailablePermissions.DELETE_SERVICE);
    return this;
  }

  view() {
    this.permission.push(AvailablePermissions.VIEW_STATUS);
    return this;
  }
}
