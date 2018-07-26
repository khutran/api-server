import * as _ from 'lodash';
import express from 'express';
import { Exception } from '../../app/Exceptions/Exception';
import CategoryRepository from '../../app/Repositories/CategoryRepository';
import { asyncMiddleware } from '../../midlewares/AsyncMiddleware';
import { Request } from '../../app/Request';
import ApiResponse from '../../app/Responses/ApiResponse';
import CategoryTransformer from '../../app/Transformers/CategoryTransformer';
import hasPermission from '../../midlewares/PermissionMiddleware';
import Permission from '../../app/Configs/AvailablePermissions';
import AuthMiddleware from '../../midlewares/AuthMiddleware';
import Error from '../../app/Exceptions/CustomsError';

let router = express.Router();

router.all('*', AuthMiddleware);

router.get('/', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getAllCategories));
router.get('/:id', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getCategoriesById));
router.post('/', hasPermission.bind(Permission.ADMIN_CREATE), asyncMiddleware(createCategories));
router.put('/:id', hasPermission.bind(Permission.ADMIN_UPDATE), asyncMiddleware(updateCategories));
router.delete('/:id', hasPermission.bind(Permission.ADMIN_DELETE), asyncMiddleware(deleteCategories));

async function getAllCategories(req, res) {
  try {
    let query = new Request('query').customs(req.query);

    let page = _.isUndefined(req.query.page) ? 1 : parseInt(req.query.page);
    let per_page = _.isUndefined(req.query.per_page) ? 10 : parseInt(req.query.per_page);
    let repository = new CategoryRepository();

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
    res.json(ApiResponse.paginate(result, new CategoryTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function getCategoriesById(req, res) {
  try {
    let id = req.params.id;
    let repository = new CategoryRepository();
    let result = await repository.where('id', id).first();

    if (!result) {
      throw new Error('Categories Not Found', 204);
    }

    res.json(ApiResponse.item(result, new CategoryTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function createCategories(req, res) {
  try {
    let data = {
      name: req.body.name
    };

    let repository = new CategoryRepository();

    let result = await repository.where('name', data.name).first();

    if (result) {
      throw new Error('Categories exists', 208);
    }

    result = await repository.create(data);
    if (!result) {
      throw new Error('Create Categories false', 500);
    }

    res.json(ApiResponse.item(result, new CategoryTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function updateCategories(req, res) {
  try {
    let id = req.params.id;
    let data = {
      name: req.body.name
    };

    let repository = new CategoryRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Categories not found', 204);
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

    res.json(ApiResponse.item(result, new CategoryTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function deleteCategories(req, res) {
  try {
    let id = req.params.id;
    let repository = new CategoryRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Categories Not found', 204);
    }

    result = await result.destroy();

    if (result === 0) {
      throw new Error('Delete Categories false', 500);
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
