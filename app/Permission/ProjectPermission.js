import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class ProjectPermission extends Permission {
  create() {
    this.permission.push(AvailablePermissions.CREATE_PROJECT);
    return this;
  }

  update() {
    this.permission.push(AvailablePermissions.UPDATE_PROJECT);
    return this;
  }

  get() {
    this.permission.push(AvailablePermissions.GET_PROJECT);
    return this;
  }

  delete() {
    this.permission.push(AvailablePermissions.DELETE_PROJECT);
    return this;
  }

  view() {
    this.permission.push(AvailablePermissions.VIEW_PROJECT);
    return this;
  }
}
