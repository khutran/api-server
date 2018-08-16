import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class CloudflarePermission extends Permission {
  async create() {
    const permission = [AvailablePermissions.CREATE_CLOUDFLARE];
    await this.checkPermisson(permission);
    return this;
  }

  async update() {
    const permission = [AvailablePermissions.UPDATE_CLOUDFLARE];
    await this.checkPermisson(permission);
    return this;
  }

  async get() {
    const permission = [AvailablePermissions.GET_CLOUDFLARE];
    await this.checkPermisson(permission);
    return this;
  }

  async delete() {
    const permission = [AvailablePermissions.DELETE_CLOUDFLARE];
    await this.checkPermisson(permission);
    return this;
  }
}
