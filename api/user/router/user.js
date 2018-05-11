import * as _ from 'lodash';
import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import { Exception } from '../../../app/Exceptions/Exception';
import UserRepository from '../../../app/Repositories/UserRepository';
import { asyncMiddleware } from '../../../midlewares/AsyncMiddleware';
// import CheckSessionMiddleware from '../../../midlewares/CheckSessionMiddleware';
import { Request } from '../../../app/Request';
import ApiResponse from '../../../app/Responses/ApiResponse';
import UserTransformer from '../../../app/Transformers/UserTransformer';
import AuthMiddleware from '../../../midlewares/AuthMiddleware';
import SingletonService from '../../../app/Services/SingletonService';
import ProjectRepository from '../../../app/Repositories/ProjectRepository';

let router = express.Router();

router.all('*', AuthMiddleware);

router.get('/', asyncMiddleware(getAllUser));
router.get('/me', asyncMiddleware(profile));
router.get('/:id', asyncMiddleware(getUserById));
router.post('/', asyncMiddleware(createUser));
router.post('/:id', asyncMiddleware(addProject));
router.put('/:id', asyncMiddleware(updateUser));
router.delete('/:id', asyncMiddleware(deleteUser));
router.post('/:id/project', asyncMiddleware(deleteProject));

async function profile(req, res) {
  let single = new SingletonService();
  let me = single.getUserLogin(req.me);
  me = _.pick(me, ['id', 'email', 'status', 'first_name', 'last_name', 'last_password_updated', 'last_login']);
  res.json({ data: me });
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
    throw new Exception(e.message, 1000);
  }
}
async function getUserById(req, res) {
  try {
    let id = req.params.id;
    let repository = new UserRepository();
    let result = await repository
      .with('project')
      .where('id', id)
      .first();

    if (!result) {
      throw new Error('User Not Found', 1000);
    }
    res.json(ApiResponse.item(result, new UserTransformer(['projects'])));
  } catch (e) {
    throw new Exception(e.message, 1000);
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
      throw new Error('User exists', 1000);
    }

    result = await repository.create(data);
    if (!result) {
      throw new Error('Create User false', 1000);
    }

    res.json(ApiResponse.item(result, new UserTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
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
      throw new Error('User not found', 1000);
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

    res.json(ApiResponse.item(result, new UserTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function deleteUser(req, res) {
  try {
    let id = req.params.id;
    let email = req.body.email;

    let repository = new UserRepository();
    let user = await repository.findById(id);

    if (!user) {
      throw new Error('User Not found', 1000);
    }

    user = await user.destroy();

    if (user === 0) {
      throw new Error('Delete User false', 1000);
    }

    res.json(ApiResponse.success());
  } catch (e) {
    throw new Exception(e.message, 1000);
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
    throw new Exception(e.message, 1000);
  }
}

async function deleteProject(req, res) {
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
    await user.removeProjects(project);

    await user.reload();
    res.json(ApiResponse.item(user, new UserTransformer(['projects'])));

  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

module.exports = router;