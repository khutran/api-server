import * as _ from 'lodash';
import express from 'express';
import { Exception } from '../../../app/Exceptions/Exception';
import StatusRepository from '../../../app/Repositories/StatusRepository';
import { asyncMiddleware } from '../../../midlewares/AsyncMiddleware';
import { Request } from '../../../app/Request';
import ApiResponse from '../../../app/Responses/ApiResponse';
import StatusTransformer from '../../../app/Transformers/StatusTransformer';
import hasPermission from '../../../midlewares/PermissionMiddleware';
import Permission from '../../../app/Configs/AvailablePermissions';

let router = express.Router();

router.get('/', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getAllStatus));
router.get('/:id', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getStatusById));
router.post('/', hasPermission.bind(Permission.ADMIN_CREATE), asyncMiddleware(createStatus));
router.put('/:id', hasPermission.bind(Permission.ADMIN_UPDATE), asyncMiddleware(updateStatus));
router.delete('/:id', hasPermission.bind(Permission.ADMIN_DELETE), asyncMiddleware(deleteStatus));

async function getAllStatus(req, res) {
  try {
    let query = new Request('query').customs(req.query);

    let page = _.isUndefined(req.query.page) ? 1 : parseInt(req.query.page);
    let per_page = _.isUndefined(req.query.per_page) ? 10 : parseInt(req.query.per_page);
    let repository = new StatusRepository();

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

    res.json(ApiResponse.paginate(result, new StatusTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}
async function getStatusById(req, res) {
  try {
    let id = req.params.id;
    let repository = new StatusRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Status Not Found', 1000);
    }

    res.json(ApiResponse.item(result, new StatusTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function createStatus(req, res) {
  try {
    let data = {
      name: req.body.name
    };

    let repository = new StatusRepository();

    let result = await repository.where('name', data.name).first();

    if (result) {
      throw new Error('Status exists', 1000);
    }

    result = await repository.create(data);
    if (!result) {
      throw new Error('Create Status false', 1000);
    }

    res.json(ApiResponse.item(result, new StatusTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function updateStatus(req, res) {
  try {
    let id = req.params.id;
    let data = {
      name: req.body.name
    };

    let repository = new StatusRepository();
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

    res.json(ApiResponse.item(result, new StatusTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function deleteStatus(req, res) {
  try {
    let id = req.params.id;
    let repository = new StatusRepository();
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
