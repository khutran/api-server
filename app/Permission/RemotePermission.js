import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class RemotePermission extends Permission {
  create() {
    this.permission.push(AvailablePermissions.CREATE_REMOTE);
    return this;
  }

  update() {
    this.permission.push(AvailablePermissions.UPDATE_REMOTE);
    return this;
  }

  get() {
    this.permission.push(AvailablePermissions.GET_REMOTE);
    return this;
  }

  delete() {
    this.permission.push(AvailablePermissions.DELETE_REMOTE);
    return this;
  }
}
