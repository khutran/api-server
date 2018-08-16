import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class FrameworkPermission extends Permission {
  async create() {
    const permission = [AvailablePermissions.CREATE_SERVICE];
    await this.checkPermisson(permission);
    return this;
  }

  async update() {
    const permission = [AvailablePermissions.UPDATE_SERVICE];
    await this.checkPermisson(permission);
    return this;
  }

  async get() {
    const permission = [AvailablePermissions.GET_SERVICE];
    await this.checkPermisson(permission);
    return this;
  }

  async delete() {
    const permission = [AvailablePermissions.DELETE_SERVICE];
    await this.checkPermisson(permission);
    return this;
  }

  async view() {
    const permission = [AvailablePermissions.VIEW_FRAMEWORK];
    const result = await this.checkView(permission);
    return result;
  }
}
