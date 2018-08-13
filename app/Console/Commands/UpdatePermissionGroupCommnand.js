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
        name: 'Inventory Management',
        slug: 'inventory_management'
      },
      {
        name: 'Product Management',
        slug: 'product_management'
      },
      {
        name: 'Account Management',
        slug: 'account_management'
      },
      {
        name: 'Order Management',
        slug: 'order_management'
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
        name: 'Admin View',
        slug: 'admin.view',
        group_slug: 'account_management'
      },
      {
        name: 'Admin Create',
        slug: 'admin.create',
        group_slug: 'account_management'
      },
      {
        name: 'Admin Update',
        slug: 'admin.update',
        group_slug: 'account_management'
      },
      {
        name: 'Admin Delete',
        slug: 'admin.delete',
        group_slug: 'account_management'
      },
      {
        name: 'User View',
        slug: 'user.view',
        group_slug: 'account_management'
      },
      {
        name: 'User Create',
        slug: 'user.create',
        group_slug: 'account_management'
      },
      {
        name: 'User Update',
        slug: 'user.update',
        group_slug: 'account_management'
      },
      {
        name: 'User Delete',
        slug: 'user.delete',
        group_slug: 'account_management'
      },
      {
        name: 'Role View',
        slug: 'role.view',
        group_slug: 'account_management'
      },
      {
        name: 'Role Create',
        slug: 'role.create',
        group_slug: 'account_management'
      },
      {
        name: 'Role Update',
        slug: 'role.update',
        group_slug: 'account_management'
      },

      {
        name: 'Role Delete',
        slug: 'role.delete',
        group_slug: 'account_management'
      },
      {
        name: 'Product View',
        slug: 'product.view',
        group_slug: 'product_management'
      },
      {
        name: 'Product Create',
        slug: 'product.create',
        group_slug: 'product_management'
      },
      {
        name: 'Product Update',
        slug: 'product.update',
        group_slug: 'product_management'
      },
      {
        name: 'Product Delete',
        slug: 'product.delete',
        group_slug: 'product_management'
      },
      {
        name: 'Customer View',
        slug: 'customer.view',
        group_slug: 'account_management'
      },
      {
        name: 'Customer Create',
        slug: 'customer.create',
        group_slug: 'account_management'
      },
      {
        name: 'Customer Update',
        slug: 'customer.update',
        group_slug: 'account_management'
      },
      {
        name: 'Customer Delete',
        slug: 'customer.delete',
        group_slug: 'account_management'
      },
      {
        name: 'Category View',
        slug: 'category.view',
        group_slug: 'product_management'
      },
      {
        name: 'Category Update',
        slug: 'category.update',
        group_slug: 'product_management'
      },
      {
        name: 'Category Create',
        slug: 'category.create',
        group_slug: 'product_management'
      },
      {
        name: 'Category Delete',
        slug: 'category.delete',
        group_slug: 'product_management'
      },
      {
        name: 'Condition View',
        slug: 'condition.view',
        group_slug: 'product_management'
      },
      {
        name: 'Condition Create',
        slug: 'condition.create',
        group_slug: 'product_management'
      },
      {
        name: 'Condition Update',
        slug: 'condition.update',
        group_slug: 'product_management'
      },
      {
        name: 'Condition Delete',
        slug: 'condition.delete',
        group_slug: 'product_management'
      },
      {
        name: 'Designer View',
        slug: 'designer.view',
        group_slug: 'product_management'
      },
      {
        name: 'Designer Create',
        slug: 'designer.create',
        group_slug: 'product_management'
      },
      {
        name: 'Designer Update',
        slug: 'designer.update',
        group_slug: 'product_management'
      },
      {
        name: 'Designer Delete',
        slug: 'designer.delete',
        group_slug: 'product_management'
      },
      {
        name: 'Order View',
        slug: 'order.view',
        group_slug: 'order_management'
      },
      {
        name: 'Order Create',
        slug: 'order.create',
        group_slug: 'order_management'
      },
      {
        name: 'Order Update',
        slug: 'order.update',
        group_slug: 'order_management'
      },
      {
        name: 'Order Delete',
        slug: 'order.delete',
        group_slug: 'order_management'
      },
      {
        name: 'Size View',
        slug: 'size.view',
        group_slug: 'product_management'
      },
      {
        name: 'Size Create',
        slug: 'size.create',
        group_slug: 'product_management'
      },
      {
        name: 'Size Update',
        slug: 'size.update',
        group_slug: 'product_management'
      },
      {
        name: 'Size Delete',
        slug: 'size.delete',
        group_slug: 'product_management'
      },
      {
        name: 'Styles View',
        slug: 'styles.view',
        group_slug: 'product_management'
      },
      {
        name: 'Styles Create',
        slug: 'styles.create',
        group_slug: 'product_management'
      },
      {
        name: 'Styles Update',
        slug: 'styles.update',
        group_slug: 'product_management'
      },
      {
        name: 'Styles Delete',
        slug: 'styles.delete',
        group_slug: 'product_management'
      },
      {
        name: 'Status View',
        slug: 'status.view',
        group_slug: 'product_management'
      },
      {
        name: 'Status Create',
        slug: 'status.create',
        group_slug: 'product_management'
      },
      {
        name: 'Status Update',
        slug: 'status.update',
        group_slug: 'product_management'
      },
      {
        name: 'Status Delete',
        slug: 'status.delete',
        group_slug: 'product_management'
      },
      {
        name: 'View Flaunt Emails',
        slug: 'flaunt.view.emails',
        group_slug: 'other'
      },
      {
        name: 'Inventory View',
        slug: 'inventory.view',
        group_slug: 'inventory_management'
      },
      {
        name: 'Inventory Create',
        slug: 'inventory.create',
        group_slug: 'inventory_management'
      },
      {
        name: 'Inventory Update',
        slug: 'inventory.update',
        group_slug: 'inventory_management'
      },
      {
        name: 'Inventory Delete',
        slug: 'inventory.delete',
        group_slug: 'inventory_management'
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
