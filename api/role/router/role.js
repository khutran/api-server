import * as _ from 'lodash';
import express from 'express';
import { Exception } from '../../../app/Exceptions/Exception';
import RoleRepository from '../../../app/Repositories/RoleRepository';
import { asyncMiddleware } from '../../../midlewares/AsyncMiddleware';
import { Request } from '../../../app/Request';
import ApiResponse from '../../../app/Responses/ApiResponse';
import RoleTransformer from '../../../app/Transformers/RoleTransformer';
import hasPermission from '../../../midlewares/PermissionMiddleware';
import Permission from '../../../app/Configs/AvailablePermissions';
import AuthMiddleware from '../../../midlewares/AuthMiddleware';

let router = express.Router();

router.all('*', AuthMiddleware);

router.get('/', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getAllRole));
router.get('/:id', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getRoleById));
router.post('/', hasPermission.bind(Permission.ADMIN_CREATE), asyncMiddleware(createRole));
router.put('/:id', hasPermission.bind(Permission.ADMIN_UPDATE), asyncMiddleware(updateRole));
router.delete('/:id', hasPermission.bind(Permission.ADMIN_DELETE), asyncMiddleware(deleteRole));

async function getAllRole(req, res) {
  try {
    let query = new Request('query').customs(req.query);

    let page = _.isUndefined(req.query.page) ? 1 : parseInt(req.query.page);
    let per_page = _.isUndefined(req.query.per_page) ? 10 : parseInt(req.query.per_page);
    let repository = new RoleRepository();

    for (let i in query['sort']) {
      repository.orderBy(i, query['sort'][i]);
    }

    if (!_.isNil(query['constraints'])) {
      for (let key in query['constraints']) {
        repository.where(key, query['constraints'][key]);
      }
    }

    if (!_.isNil(query['search'])) {
      _.forEach([], field => {
        repository.orWhere(field, 'like', query['search']);
      });
    }

    let result = await repository.paginate(per_page, page);

    res.json(ApiResponse.paginate(result, new RoleTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}
async function getRoleById(req, res) {
  try {
    let id = req.params.id;
    let repository = new RoleRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Role Not Found', 1000);
    }

    res.json(ApiResponse.item(result, new RoleTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function createRole(req, res) {
  try {
    let data = {
      name: req.body.name,
      slug: req.body.slug,
      permissions: req.body.permissions,
      description: req.body.description,
      level: req.body.level
    };

    let repository = new RoleRepository();

    let result = await repository.where('name', data.name).first();

    if (result) {
      throw new Error('Role exists', 1000);
    }

    result = await repository.create(data);
    if (!result) {
      throw new Error('Create Status false', 1000);
    }

    res.json(ApiResponse.item(result, new RoleTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function updateRole(req, res) {
  try {
    let id = req.params.id;
    let data = {
      name: req.body.name,
      slug: req.body.slug,
      permissions: req.body.permissions,
      description: req.body.description
    };

    let repository = new RoleRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Status not found', 1000);
    }

    _.mapKeys(data, (value, key) => {
      if (_.isNil(data[key])) {
        delete data[key];
      }
    });

    result = await result.update(data);

    for (let i in data) {
      if (!_.isEqual(data[i], result[i])) {
        throw new Error('Updata false', 1000);
      }
    }

    res.json(ApiResponse.item(result, new RoleTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function deleteRole(req, res) {
  try {
    let id = req.params.id;
    let repository = new RoleRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Status Not found', 1000);
    }

    result = await result.destroy();

    if (result === 0) {
      throw new Error('Delete Status false', 1000);
    }

    res.json(ApiResponse.success());
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

module.exports = router;
