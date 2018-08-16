import AvailablePermissions from '../Configs/AvailablePermissions';
import Permission from './Permission';

export default class CloudflarePermission extends Permission {
  create() {
    this.permission.push(AvailablePermissions.CREATE_CLOUDFLARE);
    return this;
  }

  update() {
    this.permission.push(AvailablePermissions.UPDATE_CLOUDFLARE);
    return this;
  }

  get() {
    this.permission.push(AvailablePermissions.GET_CLOUDFLARE);
    return this;
  }

  delete() {
    this.permission.push(AvailablePermissions.DELETE_CLOUDFLARE);
    return this;
  }
}
