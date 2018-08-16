import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class PermissionPermission extends Permission {
  async create() {
    const permission = [AvailablePermissions.CREATE_PERMISSION];
    await this.checkPermisson(permission);
    return this;
  }

  async update() {
    const permission = [AvailablePermissions.UPDATE_PERMISSION];
    await this.checkPermisson(permission);
    return this;
  }

  async get() {
    const permission = [AvailablePermissions.GET_PERMISSION];
    await this.checkPermisson(permission);
    return this;
  }

  async delete() {
    const permission = [AvailablePermissions.DELETE_PERMISSION];
    await this.checkPermisson(permission);
    return this;
  }

  async view() {
    const permission = [AvailablePermissions.VIEW_PERMISSION];
    const result = await this.checkView(permission);
    return result;
  }
}
