import { Command } from './Command';
import { App } from '../../Services/App';
import PermissionRepository from '../../Repositories/PermissionRepository';
import PermissionGroupRepository from '../../Repositories/PermissionGroupRepository';
import { NotFoundException } from '../../Exceptions/NotFoundException';

export default class UpdateGroupPermissionView extends Command {
  signature() {
    return 'update_view_and_get_permission';
  }

  description() {
    return 'edit view to get and add get permission';
  }

  async handle() {
    const view = [
      {
        name: 'View User',
        slug: 'view.user',
        group_slug: 'view'
      },
      {
        name: 'View Status',
        slug: 'view.status',
        group_slug: 'view'
      },
      {
        name: 'View Project',
        slug: 'view.project',
        group_slug: 'view'
      },
      {
        name: 'View Categories',
        slug: 'view.category',
        group_slug: 'view'
      },
      {
        name: 'View Server',
        slug: 'view.server',
        group_slug: 'view'
      },
      {
        name: 'View Framework',
        slug: 'view.framework',
        group_slug: 'view'
      },
      {
        name: 'View Role',
        slug: 'view.role',
        group_slug: 'view'
      },
      {
        name: 'View Permission',
        slug: 'view.permission',
        group_slug: 'view'
      },
      {
        name: 'View Service',
        slug: 'view.service',
        group_slug: 'view'
      },
      {
        name: 'View Service',
        slug: 'view.service',
        group_slug: 'view'
      }
    ];

    const Get = [
      {
        name: 'Get User',
        slug: 'get.user',
        group_slug: 'account_management'
      },
      {
        name: 'Get Status',
        slug: 'get.status',
        group_slug: 'project_management'
      },
      {
        name: 'Get Project',
        slug: 'get.project',
        group_slug: 'project_management'
      },
      {
        name: 'Get Categories',
        slug: 'get.category',
        group_slug: 'project_management'
      },
      {
        name: 'Get Server',
        slug: 'get.server',
        group_slug: 'project_management'
      },
      {
        name: 'Get Framework',
        slug: 'get.framework',
        group_slug: 'project_management'
      },
      {
        name: 'Get Role',
        slug: 'get.role',
        group_slug: 'account_management'
      },
      {
        name: 'Get Service',
        slug: 'get.service',
        group_slug: 'project_management'
      },
      {
        name: 'Get Cloudflare',
        slug: 'get.cloudflare',
        group_slug: 'project_management'
      },
      {
        name: 'Get Remote',
        slug: 'get.remote',
        group_slug: 'project_management'
      },
      {
        name: 'Get Permission',
        slug: 'get.permission',
        group_slug: 'account_management'
      }
    ];

    // const permission = await App.make(PermissionRepository).get();

    for (const item of view) {
      const permission = await App.make(PermissionRepository)
        .where('slug', item.slug)
        .first();

      const group = await App.make(PermissionGroupRepository)
        .where('slug', item.group_slug)
        .first();
      if (!group) {
        throw new NotFoundException(item.group_slug);
      }
      if (!permission) {
        await App.make(PermissionRepository).create({ name: item.name, slug: item.slug, group_id: group.id });
      } else {
        await App.make(PermissionRepository)
          .whereNotIn('id', [permission.id])
          .where('slug', permission.slug)
          .delete();
        await permission.update({ name: item.name, group_id: group.id });
      }
    }

    for (const item of Get) {
      const permission = await App.make(PermissionRepository)
        .where('slug', item.slug)
        .first();

      const group = await App.make(PermissionGroupRepository)
        .where('slug', item.group_slug)
        .first();
      if (!group) {
        throw new NotFoundException(item.group_slug);
      }
      if (!permission) {
        await App.make(PermissionRepository).create({ name: item.name, slug: item.slug, group_id: group.id });
      } else {
        await App.make(PermissionRepository)
          .whereNotIn('id', [permission.id])
          .where('slug', permission.slug)
          .delete();
        await permission.update({ name: item.name, group_id: group.id });
      }
    }
    process.exit();
  }
}
