import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class RolePermission extends Permission {
  async create() {
    const permission = [AvailablePermissions.CREATE_ROLE];
    await this.checkPermisson(permission);
    return this;
  }

  async update() {
    const permission = [AvailablePermissions.UPDATE_ROLE];
    await this.checkPermisson(permission);
    return this;
  }

  async get() {
    const permission = [AvailablePermissions.GET_ROLE];
    await this.checkPermisson(permission);
    return this;
  }

  async delete() {
    const permission = [AvailablePermissions.DELETE_ROLE];
    await this.checkPermisson(permission);
    return this;
  }

  async view() {
    const permission = [AvailablePermissions.VIEW_ROLE];
    const result = await this.checkView(permission);
    return result;
  }
}
