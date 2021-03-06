import * as _ from 'lodash';
import express from 'express';
import { Exception } from '../../app/Exceptions/Exception';
import ProjectRepository from '../../app/Repositories/ProjectRepository';
import { asyncMiddleware } from '../../midlewares/AsyncMiddleware';
import { Request } from '../../app/Request';
import ApiResponse from '../../app/Responses/ApiResponse';
import ProjectTransformer from '../../app/Transformers/ProjectTransformer';
import hasPermission from '../../midlewares/PermissionMiddleware';
import Permission from '../../app/Configs/AvailablePermissions';
import AuthMiddleware from '../../midlewares/AuthMiddleware';
import BuildTransformer from '../../app/Transformers/BuildTransformer';
import Error from '../../app/Exceptions/CustomsError';

let router = express.Router();
router.all('*', AuthMiddleware);

router.get('/', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getAllProject));
router.get('/:id', hasPermission.bind(Permission.USER_VIEW), asyncMiddleware(getProjectById));
router.post('/', hasPermission.bind(Permission.ADMIN_CREATE), asyncMiddleware(createProject));
router.put('/:id', hasPermission.bind(Permission.ADMIN_UPDATE), asyncMiddleware(updateProject));
router.delete('/:id', hasPermission.bind(Permission.ADMIN_DELETE), asyncMiddleware(deleteProject));
router.get('/:id/build', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getProjectBuild));
router.post('/:id/build', hasPermission.bind(Permission.ADMIN_CREATE), asyncMiddleware(addProjectBuild));
router.put('/:id/build', hasPermission.bind(Permission.ADMIN_UPDATE), asyncMiddleware(updateProjectBuild));
router.delete('/:id/build', hasPermission.bind(Permission.ADMIN_DELETE), asyncMiddleware(deleteProjectBuild));

async function getProjectBuild(req, res) {
  try {
    const id = req.params.id;
    const repository = new ProjectRepository();
    const result = await repository.findById(id);

    const build = await result.getBuild();
    if (!build) {
      throw new Error('Project not craete Build', 204);
    }
    res.json(ApiResponse.item(build, new BuildTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function addProjectBuild(req, res) {
  try {
    const id = req.params.id;
    const b = {
      project_id: id,
      host_id: req.body.host_id,
      git: req.body.git,
      git_branch: req.body.git_branch,
      git_key: req.body.git_key,
      git_secret: req.body.git_secret,
      build_auto: req.body.build_auto,
      backup: req.body.backup,
      last_build: new Date()
    };
    const repository = new ProjectRepository();

    const result = await repository.findById(id);

    if (!result) {
      throw new Error('Project not found', 204);
    }

    let build = await result.getBuild();

    if (!_.isNil(build)) {
      throw new Error('Project build already', 208);
    }

    build = await result.createBuild(b);

    res.json(ApiResponse.item(build, new BuildTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function updateProjectBuild(req, res) {
  try {
    const id = req.params.id;
    const b = {
      project_id: id,
      host_id: req.body.host_id,
      git: req.body.git,
      git_branch: req.body.git_branch,
      git_key: req.body.git_key,
      git_secret: req.body.git_secret,
      build_auto: req.body.build_auto,
      backup: req.body.backup
    };

    _.mapKeys(b, (value, key) => {
      if (_.isNil(b[key])) {
        delete b[key];
      }
    });

    const repository = new ProjectRepository();

    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Project not found', 204);
    }

    let build = await result.getBuild();

    if (_.isNil(build)) {
      throw new Error('Project not create build', 500);
    }

    build = await build.update(b);
    build.reload();
    res.json(ApiResponse.item(build, new BuildTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function deleteProjectBuild(req, res) {
  try {
    const id = req.params.id;

    const repository = new ProjectRepository();

    let result = await repository.findById(id);

    let build = await result.getBuild();

    if (!build) {
      throw new Error('Project not found', 204);
    }

    await build.destroy();
    res.json(ApiResponse.success());
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function getAllProject(req, res) {
  try {
    let query = new Request('query').customs(req.query);

    let page = _.isUndefined(req.query.page) ? 1 : parseInt(req.query.page);
    let per_page = _.isUndefined(req.query.per_page) ? 10 : parseInt(req.query.per_page);
    let repository = new ProjectRepository();

    for (let i in query['sort']) {
      repository.orderBy(i, query['sort'][i]);
    }

    if (!_.isNil(query['constraints'])) {
      for (let key in query['constraints']) {
        repository.where(key, query['constraints'][key]);
      }
    }

    if (!_.isNil(query['search'])) {
      _.forEach(['name'], field => {
        repository.orWhere(field, 'like', query['search']);
      });
    }

    let result = await repository.paginate(per_page, page);
    res.json(ApiResponse.paginate(result, new ProjectTransformer(['status', 'build', 'framework', 'csdl', 'categories'])));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}
async function getProjectById(req, res) {
  try {
    let id = req.params.id;
    let repository = new ProjectRepository();
    let result = await repository.findById(id);
    if (!result) {
      throw new Error('Project Not Found', 204);
    }
    res.json(ApiResponse.item(result, new ProjectTransformer(['status', 'build', 'framework', 'csdl', 'categories'])));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function createProject(req, res) {
  try {
    let data = {
      name: req.body.name,
      category_id: req.body.category_id,
      framework_id: req.body.framework_id,
      csdl_id: req.body.csdl_id,
      status_id: req.body.status_id
    };

    let repository = new ProjectRepository();

    let result = await repository.where('name', data.name).first();

    if (result) {
      throw new Error('Project exists', 208);
    }

    let item = await repository.create(data);
    if (!item) {
      throw new Error('Create Project false', 500);
    }
    await item.reload();
    res.json(ApiResponse.item(item, new ProjectTransformer(['status', 'build', 'framework', 'csdl'])));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function updateProject(req, res) {
  try {
    let id = req.params.id;
    let data = {
      name: req.body.name,
      category_id: req.body.category_id,
      framework_id: req.body.framework_id,
      csdl_id: req.body.csdl_id,
      status_id: req.body.status_id
    };

    let repository = new ProjectRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Project not found', 204);
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
    await result.reload();
    res.json(ApiResponse.item(result, new ProjectTransformer(['status', 'build', 'framework', 'csdl'])));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function deleteProject(req, res) {
  try {
    let id = req.params.id;
    let repository = new ProjectRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Project Not found', 204);
    }

    result = await result.destroy();

    if (result === 0) {
      throw new Error('Delete Project false', 500);
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
