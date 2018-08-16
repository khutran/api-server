import { Command } from './Command';
import { App } from '../../Services/App';
import _ from 'lodash';
import PermissionRepository from '../../Repositories/PermissionRepository';
import RoleRepository from '../../Repositories/RoleRepository';

export default class UpdateProjectTableBuildtimeAndCloudflareCommand extends Command {
  signature() {
    return 'update_permission_admin';
  }

  description() {
    return 'update permission admin';
  }

  options() {
    // return [{ key: 'option_name?', description: 'The description for option here' }];
  }

  async handle() {
    const permission = await App.make(PermissionRepository).get();
    const role = await App.make(RoleRepository).findById(1);
    const P = await role.getPermissions();
    _.forEach(permission, async item => {
      let i = _.find(P, y => y.slug === item.slug);
      if (_.isUndefined(i)) {
        await role.addPermission(item);
      }
    });

    process.exit();
  }
}
