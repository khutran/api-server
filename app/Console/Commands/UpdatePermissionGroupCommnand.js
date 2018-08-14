import { Command } from './Command';
import { App } from '../../Services/App';
import PermissionRepository from '../../Repositories/PermissionRepository';
import PermissionGroupRepository from '../../Repositories/PermissionGroupRepository';
import _ from 'lodash';
import { NotFoundException } from '../../Exceptions/NotFoundException';

export default class UpdatePermissionGroupCommand extends Command {
  signature() {
    return 'update_permission_group';
  }

  description() {
    return 'Update permissions and permission_group table based on given data';
  }

  async handle() {
    const groups = [
      {
        name: 'Project Management',
        slug: 'project_management'
      },
      {
        name: 'Account Management',
        slug: 'account_management'
      },
      {
        name: 'Other',
        slug: 'other'
      }
    ];
    await App.make(PermissionGroupRepository)
      .whereNotIn('slug', _.map(groups, item => item.slug))
      .delete();
    for (const item of groups) {
      const group = await App.make(PermissionGroupRepository)
        .where('slug', item.slug)
        .first();
      if (!group) {
        await App.make(PermissionGroupRepository).create(item);
      } else {
        await group.update({ name: item.name });
      }
    }

    const permissions = [
      {
        name: 'View User',
        slug: 'view.user',
        group_slug: 'account_management'
      },
      {
        name: 'Create User',
        slug: 'create.user',
        group_slug: 'account_management'
      },
      {
        name: 'Update User',
        slug: 'create.user',
        group_slug: 'account_management'
      },
      {
        name: 'Delete User',
        slug: 'delete.user',
        group_slug: 'account_management'
      },
      {
        name: 'Create Role',
        slug: 'create.role',
        group_slug: 'account_management'
      },
      {
        name: 'Update Role',
        slug: 'update.role',
        group_slug: 'account_management'
      },
      {
        name: 'View Role',
        slug: 'view.role',
        group_slug: 'account_management'
      },
      {
        name: 'Delete Role',
        slug: 'delete.role',
        group_slug: 'account_management'
      },
      {
        name: 'Create Service',
        slug: 'create.service',
        group_slug: 'project_management'
      },
      {
        name: 'Update Service',
        slug: 'update.service',
        group_slug: 'project_management'
      },
      {
        name: 'View Service',
        slug: 'view.service',
        group_slug: 'project_management'
      },
      {
        name: 'Delete Service',
        slug: 'delete.service',
        group_slug: 'project_management'
      },
      {
        name: 'Create Application',
        slug: 'create.application',
        group_slug: 'project_management'
      },
      {
        name: 'Update Application',
        slug: 'update.application',
        group_slug: 'project_management'
      },
      {
        name: 'View Application',
        slug: 'view.application',
        group_slug: 'project_management'
      },
      {
        name: 'Delete Application',
        slug: 'delete.application',
        group_slug: 'project_management'
      }
    ];

    await App.make(PermissionRepository)
      .whereNotIn('slug', _.map(permissions, item => item.slug))
      .delete();
    for (const item of permissions) {
      const permission = await App.make(PermissionRepository)
        .where('slug', item.slug)
        .first();

      await App.make(PermissionRepository)
        .whereNotIn('id', [permission.id])
        .where('slug', permission.slug)
        .delete();

      const group = await App.make(PermissionGroupRepository)
        .where('slug', item.group_slug)
        .first();
      if (!group) {
        throw new NotFoundException(item.group_slug);
      }
      if (!permission) {
        await App.make(PermissionRepository).create({ name: item.name, slug: item.slug, group_id: group.id });
      } else {
        await permission.update({ name: item.name, group_id: group.id });
      }
    }
    process.exit();
  }
}
