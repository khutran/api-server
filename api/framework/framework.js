import * as _ from 'lodash';
import express from 'express';
import { Exception } from '../../app/Exceptions/Exception';
import FrameworkRepository from '../../app/Repositories/FrameworkRepository';
import { asyncMiddleware } from '../../midlewares/AsyncMiddleware';
import { Request } from '../../app/Request';
import ApiResponse from '../../app/Responses/ApiResponse';
import FrameworkTransformer from '../../app/Transformers/FrameworkTransformer';
import hasPermission from '../../midlewares/PermissionMiddleware';
import Permission from '../../app/Configs/AvailablePermissions';
import AuthMiddleware from '../../midlewares/AuthMiddleware';
import Error from '../../app/Exceptions/CustomsError';

let router = express.Router();

router.all('*', AuthMiddleware);

router.get('/', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getAllFramework));
router.get('/:id', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getFrameworkById));
router.post('/', hasPermission.bind(Permission.ADMIN_CREATE), asyncMiddleware(createFramework));
router.put('/:id', hasPermission.bind(Permission.ADMIN_UPDATE), asyncMiddleware(updateFramework));
router.delete('/:id', hasPermission.bind(Permission.ADMIN_DELETE), asyncMiddleware(deleteFramework));

async function getAllFramework(req, res) {
  try {
    let query = new Request('query').customs(req.query);

    let page = _.isUndefined(req.query.page) ? 1 : parseInt(req.query.page);
    let per_page = _.isUndefined(req.query.per_page) ? 10 : parseInt(req.query.per_page);
    let repository = new FrameworkRepository();

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
    res.json(ApiResponse.paginate(result, new FrameworkTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function getFrameworkById(req, res) {
  try {
    let id = req.params.id;
    let repository = new FrameworkRepository();
    let result = await repository.where('id', id).first();

    if (!result) {
      throw new Error('Framework Not Found', 204);
    }

    res.json(ApiResponse.item(result, new FrameworkTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function createFramework(req, res) {
  try {
    let data = {
      name: req.body.name,
      csdl: req.body.csdl,
      package_manager: req.body.package_manager
    };

    let repository = new FrameworkRepository();

    let result = await repository.where('name', data.name).first();

    if (result) {
      throw new Error('Framework exists', 208);
    }

    result = await repository.create(data);
    if (!result) {
      throw new Error('Create Framework false', 500);
    }

    res.json(ApiResponse.item(result, new FrameworkTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function updateFramework(req, res) {
  try {
    let id = req.params.id;
    let data = {
      name: req.body.name,
      csdl: req.body.csdl,
      package_manager: req.body.package_manager
    };

    let repository = new FrameworkRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Framework not found', 204);
    }

    _.mapKeys(data, (value, key) => {
      if (_.isNil(data[key])) {
        delete data[key];
      }
    });

    result = await result.update(data);

    for (let i in data) {
      if (!_.isEqual(data[i], result[i])) {
        throw new Error('Updata false', 500);
      }
    }

    res.json(ApiResponse.item(result, new FrameworkTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function deleteFramework(req, res) {
  try {
    let id = req.params.id;
    let repository = new FrameworkRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Framework Not found', 204);
    }

    result = await result.destroy();

    if (result === 0) {
      throw new Error('Delete Framework false', 500);
    }

    res.json(ApiResponse.success());
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

module.exports = router;
