import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class RemotePermission extends Permission {
  async create() {
    const permission = [AvailablePermissions.CREATE_REMOTE];
    await this.checkPermisson(permission);
    return this;
  }

  async update() {
    const permission = [AvailablePermissions.UPDATE_REMOTE];
    await this.checkPermisson(permission);
    return this;
  }

  async get() {
    const permission = [AvailablePermissions.GET_REMOTE];
    await this.checkPermisson(permission);
    return this;
  }

  async delete() {
    const permission = [AvailablePermissions.DELETE_REMOTE];
    await this.checkPermisson(permission);
    return this;
  }
}
