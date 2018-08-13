import * as _ from 'lodash';
import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import RoleRepository from '../../../app/Repositories/RoleRepository';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import { AvailablePermissions } from '../../../app/Configs/AvailablePermissions';
import ApiResponse from '../../../app/Responses/ApiResponse';
import RoleTransformer from '../../../app/Transformers/RoleTransformer';
import UserTransformer from '../../../app/Transformers/UserTransformer';
import { Exception } from '../../../app/Exceptions/Exception';
import { Request } from '../../../app/Services/Facades/Request';
import { RoleValidator, RULE_CREATE_ROLE } from '../../../app/Validators/RoleValidator';
import { App } from '../../../app/Services/App';
import PermissionRepository from '../../../app/Repositories/PermissionRepository';

const router = express.Router();

router.all('*', AuthMiddleware);

router.get('/', AsyncMiddleware(index));
router.post('/list', AsyncMiddleware(list));
router.get('/:id', AsyncMiddleware(getRoleById));
router.post('/', AsyncMiddleware(store));
router.put('/:id', AsyncMiddleware(update));
router.post('/:role_id/permissions', AsyncMiddleware(attachPermissionsToRole));
router.put('/:role_id/permissions', AsyncMiddleware(setPermissionsToRole));
router.delete('/:role_id/permissions', AsyncMiddleware(dettachPermissonFromRole));
router.delete('/:id', AsyncMiddleware(destroy));
router.get('/:id/list-users', AsyncMiddleware(listUsers));

async function index(req, res) {
  const repository = new RoleRepository();

  repository.applySearchFromRequest(['name']);

  repository.applyConstraintsFromRequest();

  repository.applyOrderFromRequest(['id', 'name']);

  const result = await repository.paginate();

  res.json(ApiResponse.paginate(result, new RoleTransformer()));
}

async function list(req, res) {
  const repository = new RoleRepository();

  repository.applySearchFromRequest();

  repository.applyConstraintsFromRequest();

  repository.applyOrderFromRequest();

  const transformer = new RoleTransformer();

  // if (Request.has('includes')) {
  //   const includes = Request.get('includes').split(',');
  //   if (_.includes(includes, 'permissions')) {
  //     transformer.with('permissions');
  //   }
  // }

  const result = await repository.get();

  res.json(ApiResponse.collection(result, transformer));
}

async function getRoleById(req, res) {
  const id = req.params.id;
  const repository = new RoleRepository();
  const role = await repository.findById(id);

  if (!role) {
    throw new Exception('Role not found', 1000);
  }

  res.json(ApiResponse.item(role, new RoleTransformer(['permission'])));
}

async function store(req, res) {
  RoleValidator.isValid(Request.all(), RULE_CREATE_ROLE);
  const data = {
    name: Request.get('name')
  };

  const repository = new RoleRepository();

  const role = await repository.where('slug', _.snakeCase(data.name)).first();

  if (role) {
    throw new Exception('Role already exist', 4012);
  }

  const result = await repository.create(data);

  res.json(ApiResponse.item(result, new RoleTransformer()));
}

async function setPermissionsToRole(req, res) {
  RoleValidator.isValid(Request.all(), 'setPermissionsToRole');
  const role_id = req.params.role_id;

  const permissions = await App.make(PermissionRepository).get();
  const available_permissions = _.map(permissions, item => item.slug);
  _.forEach(Request.get('permissions'), item => {
    if (!_.includes(available_permissions, item)) {
      throw new Exception(`${item} is not a valid permission`, 1000);
    }
  });

  const role = await App.make(RoleRepository).findById(role_id);

  const result = await role.update({ permissions: Request.get('permissions') });

  res.json(ApiResponse.item(result, new RoleTransformer(['permissions'])));
}

async function update(req, res) {
  const id = req.params.id;
  const data = {
    name: req.body.name,
    updated_at: new Date()
  };
  const repository = new RoleRepository();
  const role = await repository.findById(id);

  if (!role) {
    throw new Exception('Role not found', 1000);
  }

  const result = await role.update(data);

  if (!result) {
    throw new Exception('Can not update record', 1000);
  }

  res.json(ApiResponse.item(result, new RoleTransformer()));
}

async function attachPermissionsToRole(req, res) {
  const role_id = req.params.role_id;
  const permission = req.body.permission;

  let exist = false;
  for (const k in AvailablePermissions) {
    if (AvailablePermissions[k] === permission) {
      exist = true;
    }
  }

  if (!exist) {
    throw new Exception('Permission not found', 1000);
  }

  const repository = new RoleRepository();

  const role = await repository.findById(role_id);

  if (!role) {
    throw new Exception('Role not found', 1000);
  }

  role.permissions = JSON.parse(role.permissions);
  if (_.isNil(role.permissions)) {
    role.permissions = [];
  }
  if (role.permissions.indexOf(permission) > -1) {
    throw new Exception('The permisson already attached', 1000);
  }
  let permissions = [];
  if (typeof role.permissions === 'string') {
    permissions = JSON.parse(role.permissions);
  }

  const result = await role.update({ permissions: _.uniq([...permissions, permission]) });

  if (!result) {
    throw new Exception('Role attach permissions error', 1000);
  }

  res.json(ApiResponse.item(result, new RoleTransformer()));
}

async function dettachPermissonFromRole(req, res) {
  const role_id = req.params.role_id;
  const permission = req.body.permission;

  let exist = false;
  for (const k in AvailablePermissions) {
    if (AvailablePermissions[k] === permission) {
      exist = true;
    }
  }

  if (!exist) {
    throw new Exception('Permission not found', 1000);
  }

  const repository = new RoleRepository();
  const role = await repository.findById(role_id);

  if (!role) {
    throw new Exception('Role not found', 1000);
  }

  let permissions = [];
  if (typeof role.permissions === 'string') {
    permissions = JSON.parse(role.permissions);
  }

  if (typeof role.permissions === 'object') {
    permissions = JSON.parse(JSON.stringify(role.permissions));
  }

  if (_.isNil(role.permissions) || permissions.indexOf(permission) < 0) {
    throw new Exception('Permission is not attached to role', 1000);
  }

  const result = await role.update({ permissions: _.filter(permissions, item => item !== permission) });

  if (!result) {
    throw new Exception('Dettach permission error', 1000);
  }
  res.json(ApiResponse.item(result, new RoleTransformer()));
}

async function destroy(req, res) {
  const id = req.params.id;

  const repository = new RoleRepository();

  const role = await repository.findById(id);
  if (!role) {
    throw new Exception('Role not found', 1000);
  }

  const results = await role.destroy();

  if (results === 0) {
    throw new Exception('Delete error', 1000);
  }

  res.json(ApiResponse.success());
}

async function listUsers(req, res) {
  const role_id = req.params.id;

  const repository = new RoleRepository();
  const role = await repository
    .where('id', role_id)
    .with('user')
    .first();

  if (!role) {
    throw new Exception('Role not found', 1000);
  }

  res.json(ApiResponse.collection(role.users, new UserTransformer()));
}

module.exports = router;
