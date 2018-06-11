import * as _ from 'lodash';
import express from 'express';
import { Exception } from '../../app/Exceptions/Exception';
import UserRepository from '../../app/Repositories/UserRepository';
import { asyncMiddleware } from '../../midlewares/AsyncMiddleware';
import { Request } from '../../app/Request';
import ApiResponse from '../../app/Responses/ApiResponse';
import UserTransformer from '../../app/Transformers/UserTransformer';
import RoleRepository from '../../app/Repositories/RoleRepository';
import AuthMiddleware from '../../midlewares/AuthMiddleware';
import ProjectRepository from '../../app/Repositories/ProjectRepository';
import hasPermission from '../../midlewares/PermissionMiddleware';
import Permission from '../../app/Configs/AvailablePermissions';
import Error from '../../app/Exceptions/CustomsError';

let router = express.Router();

router.all('*', AuthMiddleware);

router.get('/', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getAllUser));
router.get('/me', hasPermission.bind(Permission.USER_VIEW), asyncMiddleware(profile));
router.get('/:id', hasPermission.bind(Permission.ADMIN_CREATE), asyncMiddleware(getUserById));
router.post('/', hasPermission.bind(Permission.ADMIN_CREATE), asyncMiddleware(createUser));
router.post('/:id', hasPermission.bind(Permission.ADMIN_CREATE), asyncMiddleware(addProject));
router.post('/:id/role', hasPermission.bind(Permission.ADMIN_CREATE), asyncMiddleware(addRole));
router.put('/:id/role', hasPermission.bind(Permission.ADMIN_UPDATE), asyncMiddleware(updateRole));
router.put('/:id', hasPermission.bind(Permission.ADMIN_UPDATE), asyncMiddleware(updateUser));
router.delete('/:id', hasPermission.bind(Permission.ADMIN_DELETE), asyncMiddleware(deleteUser));
router.delete('/:id/project', hasPermission.bind(Permission.ADMIN_DELETE), asyncMiddleware(deleteProject));

async function addRole(req, res) {
  try {
    const user_id = req.params.id;
    const role_id = req.body.role_id;

    let repository = new UserRepository();
    let roleRepository = new RoleRepository();
    let user = await repository
      .where('id', user_id)
      .withScope('scopeRole-Project')
      .first();

    let role = await roleRepository.findById(role_id);
    await user.addRole(role);
    await user.reload();
    res.json(ApiResponse.item(user, new UserTransformer(['roles'])));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function updateRole(req, res) {
  try {
    const user_id = req.params.id;
    const role_id = req.body.role_id;

    let repository = new UserRepository();
    let roleRepository = new RoleRepository();
    let user = await repository
      .where('id', user_id)
      .withScope('scopeRole-Project')
      .first();

    let role = await roleRepository.findById(role_id);
    let oldR = await user.getRoles();
    await user.removeRole(oldR);
    await user.addRole(role);
    await user.reload();
    res.json(ApiResponse.item(user, new UserTransformer(['roles'])));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function profile(req, res) {
  try {
    let repository = new UserRepository();
    let me = await repository
      .with('project')
      .withScope('scopeRole-Project')
      .where('id', req.me)
      .first();

    res.json(ApiResponse.item(me, new UserTransformer(['projects', 'roles'])));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function getAllUser(req, res) {
  try {
    let query = new Request('query').customs(req.query);

    let page = _.isUndefined(req.query.page) ? 1 : parseInt(req.query.page);
    let per_page = _.isUndefined(req.query.per_page) ? 10 : parseInt(req.query.per_page);

    let repository = new UserRepository();

    for (let i in query['sort']) {
      repository.orderBy(i, query['sort'][i]);
    }

    if (!_.isNil(query['constraints'])) {
      for (let key in query['constraints']) {
        repository.where(key, query['constraints'][key]);
      }
    }

    if (!_.isNil(query['search'])) {
      _.forEach(['email'], field => {
        repository.orWhere(field, 'like', query['search']);
      });
    }

    let result = await repository.with('project').paginate(per_page, page);

    res.json(ApiResponse.paginate(result, new UserTransformer(['projects'])));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}
async function getUserById(req, res) {
  try {
    let id = req.params.id;
    let repository = new UserRepository();
    let result = await repository
      .with('project')
      .withScope('scopeRole-Project')
      .where('id', id)
      .first();

    if (!result) {
      throw new Error('User Not Found', 204);
    }
    console.log(result.projects);
    res.json(ApiResponse.item(result, new UserTransformer(['projects', 'roles'])));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function createUser(req, res) {
  try {
    let data = {
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
      status: 0
    };

    let repository = new UserRepository();

    let result = await repository.where('email', data.email).first();

    if (result) {
      throw new Error('User exists', 208);
    }

    result = await repository.create(data);
    if (!result) {
      throw new Error('Create User false', 500);
    }

    res.json(ApiResponse.item(result, new UserTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function updateUser(req, res) {
  try {
    let id = req.params.id;
    let data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
      status: req.body.status
    };

    let repository = new UserRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('User not found', 204);
    }

    _.mapKeys(data, (value, key) => {
      if (_.isNil(data[key])) {
        delete data[key];
      }
    });

    result = await result.update(data);

    for (let i in data) {
      if (!_.isEqual(data[i], result[i]) && i !== 'password') {
        throw new Error('Updata false', 500);
      }
    }

    res.json(ApiResponse.item(result, new UserTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function deleteUser(req, res) {
  try {
    let id = req.params.id;

    let repository = new UserRepository();
    let user = await repository.findById(id);

    if (!user) {
      throw new Error('User Not found', 204);
    }

    user = await user.destroy();

    if (user === 0) {
      throw new Error('Delete User false', 500);
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

async function addProject(req, res) {
  try {
    let user_id = req.params.id;
    let project_id = req.body.project_id;

    let repositoryUser = new UserRepository();
    let repositoryProject = new ProjectRepository();
    let user = await repositoryUser
      .where('id', user_id)
      .with('project')
      .first();

    let project = await repositoryProject.findById(project_id);
    await user.addProjects(project);

    await user.reload();
    res.json(ApiResponse.item(user, new UserTransformer(['projects'])));
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
    let user_id = req.params.id;
    let project_id = req.query.project_id;

    let repositoryUser = new UserRepository();
    let repositoryProject = new ProjectRepository();
    let user = await repositoryUser
      .where('id', user_id)
      .with('project')
      .first();

    let project = await repositoryProject.findById(project_id);
    await user.removeProjects(project);

    await user.reload();
    res.json(ApiResponse.item(user, new UserTransformer(['projects'])));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

module.exports = router;
