import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class ProjectPermission extends Permission {
  async create() {
    const permission = [AvailablePermissions.CREATE_PROJECT];
    await this.checkPermisson(permission);
    return this;
  }

  async update() {
    const permission = [AvailablePermissions.UPDATE_PROJECT];
    await this.checkPermisson(permission);
    return this;
  }

  async view() {
    const permission = [AvailablePermissions.VIEW_PROJECT];
    await this.checkPermisson(permission);
    return this;
  }

  async delete() {
    const permission = [AvailablePermissions.DELETE_PROJECT];
    await this.checkPermisson(permission);
    return this;
  }
}
