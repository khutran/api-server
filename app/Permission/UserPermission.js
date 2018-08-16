import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class UserPermission extends Permission {
  async create() {
    const permission = [AvailablePermissions.CREATE_USER];
    await this.checkPermisson(permission);
    return this;
  }

  async update() {
    const permission = [AvailablePermissions.UPDATE_USER];
    await this.checkPermisson(permission);
    return this;
  }

  async get() {
    const permission = [AvailablePermissions.GET_USER];
    await this.checkPermisson(permission);
    return this;
  }

  async delete() {
    const permission = [AvailablePermissions.DELETE_USER];
    await this.checkPermisson(permission);
    return this;
  }
}
