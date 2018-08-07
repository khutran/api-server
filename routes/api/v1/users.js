import _ from 'lodash';
import express from 'express';
import jwt from 'jsonwebtoken';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import UserRepository from '../../../app/Repositories/UserRepository';
import { SendUpdateEmailNotification } from '../../../app/Notifications/SendUpdateEmailNotification';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import ApiResponse from '../../../app/Responses/ApiResponse';
import UserTransformer from '../../../app/Transformers/UserTransformer';
import { App } from '../../../app/Services/App';
import RoleRepository from '../../../app/Repositories/RoleRepository';
import RoleUserRepository from '../../../app/Repositories/RoleUserRepository';
import { Auth } from '../../../app/Services/Facades/Auth';
import { Request } from '../../../app/Services/Facades/Request';
import { NotFoundException } from '../../../app/Exceptions/NotFoundException';
import { Exception } from '../../../app/Exceptions/Exception';
import { UserValidator, CREATE_USER_RULE } from '../../../app/Validators/UserValidator';
import PasswordUtil from '../../../app/Utils/PasswordUtil';
import { BadRequestHttpException } from '../../../app/Exceptions/BadRequestHttpException';
import ProjectRepository from '../../../app/Repositories/ProjectRepository';

const router = express.Router();

router.all('*', AuthMiddleware);

router.get('/', AsyncMiddleware(index));
router.get('/:id', AsyncMiddleware(show));
router.post('/', AsyncMiddleware(store));
router.put('/me', AsyncMiddleware(updateMyProfile));
router.put('/:id', AsyncMiddleware(update));
router.delete('/:id', AsyncMiddleware(destroy));
router.put('/:user_id/role', AsyncMiddleware(attachRole));
router.put('/:user_id/roles', AsyncMiddleware(saveUserRole));
router.delete('/:user_id/role/:role_id', AsyncMiddleware(dettachRole));
router.get('/:user_id/permissions', AsyncMiddleware(getPermissions));
router.get('/:user_id/roles', AsyncMiddleware(getRoles));
router.post('/list', AsyncMiddleware(list));
router.post('/:user_id/projects', AsyncMiddleware(addProject));
router.delete('/:user_id/projects', AsyncMiddleware(deleteProject));

async function deleteProject(req, res) {
  const userId = req.params.user_id;
  const projectId = req.query.project_id;
  const repository = new UserRepository();
  const user = await repository
    .where('id', userId)
    .with('project')
    .first();
  if (!user) {
    throw new NotFoundException('User');
  }
  let check = false;
  const listProject = await user.getProjects();
  _.forEach(listProject, item => {
    if (parseInt(item.id) === parseInt(projectId)) {
      check = true;
    }
  });
  if (!check) {
    throw new Exception('Project not exists', 1000);
  }
  const project = await App.make(ProjectRepository).findById(projectId);
  if (!project) {
    throw new NotFoundException('Project');
  }
  await user.removeProject(project);
  await user.reload();
  res.json(ApiResponse.item(user, new UserTransformer(['projects'])));
}

async function addProject(req, res) {
  const userId = req.params.user_id;
  const projectId = req.body.project_id;
  const repository = new UserRepository();
  const user = await repository
    .where('id', userId)
    .with('project')
    .first();
  if (!user) {
    throw new NotFoundException('User');
  }
  const listProject = await user.getProjects();
  _.forEach(listProject, item => {
    if (item.id === projectId) {
      throw new Exception('user exists project', 1000);
    }
  });
  const project = await App.make(ProjectRepository).findById(projectId);
  if (!project) {
    throw new NotFoundException('Project');
  }
  await user.addProject(project);
  await user.reload();
  res.json(ApiResponse.item(user, new UserTransformer(['projects'])));
}

async function list(req, res) {
  const repository = new UserRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name']);
  repository.applyOrderFromRequest();
  const result = await repository.get();
  res.json(ApiResponse.collection(result, new UserTransformer()));
}

async function index(req, res) {
  const repository = new UserRepository();

  repository.applySearchFromRequest(['email']);

  repository.applyConstraintsFromRequest();

  repository.applyOrderFromRequest();

  if (Request.has('roles')) {
    const roles = Request.get('roles').split(',');
    repository.whereHas('role', function(q) {
      q.whereIn('slug', roles);
      return q;
    });
  }

  const result = await repository.paginate();

  res.json(ApiResponse.paginate(result, new UserTransformer()));
}

async function show(req, res) {
  const userId = req.params.id;
  const repository = new UserRepository();
  const user = await repository.where('id', userId).first();
  if (!user) {
    throw new NotFoundException('User');
  }

  res.json(ApiResponse.item(user, new UserTransformer()));
}

async function store(req, res) {
  if (Request.get('password') !== Request.get('re_password')) {
    throw new Error('Password does not match', 1000);
  }

  UserValidator.isValid(Request.all(), CREATE_USER_RULE);

  const role = await App.make(RoleRepository).findById(Request.get('role_id'));

  const repository = new UserRepository();
  const item = await repository.where('email', req.body.email).first();
  if (item) {
    throw new Exception('User exitsts', 4008);
  }
  const data = {
    email: Request.get('email'),
    password: new PasswordUtil().encrypt(req.body.password),
    password_type: PasswordUtil.DEFAULT_PASSWORD
  };

  const user = await repository.create(data);

  await user.addRole(role);

  res.json(ApiResponse.item(user, new UserTransformer()));
}

async function update(req, res) {
  const user_id = req.params.id;
  const repository = new UserRepository();
  const user = await repository.findById(user_id);
  if (Request.has('email') && Request.get('email') !== user.email) {
    const isExistEmail =
      (await repository
        .where('email', Request.get('email'))
        .where('id', '<>', user_id)
        .count()) > 0;
    if (isExistEmail) {
      throw new BadRequestHttpException('Email already exist', 1000);
    }
  }

  const transformer = new UserTransformer();

  let result = await App.make(UserRepository).findById(user_id);

  res.json(ApiResponse.item(result, transformer));
}

async function updateMyProfile(req, res) {
  const id = Auth.user().id;
  const changes = { updated_at: new Date() };

  if (req.body.email) changes['email'] = req.body.email;

  const user = await updateUserFn(id, changes);

  res.json(ApiResponse.item(user, new UserTransformer()));
}

async function updateUserFn(id, data) {
  let user = null;
  if (!data.email) {
    user = await App.make(UserRepository).updateOrCreate(data, { id });
  } else {
    user = await App.make(UserRepository).findById(id);
    if (user.email !== data.email) {
      const existing_user = await App.make(UserRepository)
        .where('email', data.email)
        .first();

      if (existing_user) {
        throw new Exception('Email already exists', 1000);
      }

      const reset_token = jwt.sign(
        {
          data: _.pick(user, ['email', 'status'])
        },
        process.env.JWT_SECRET,
        { expiresIn: 60000 }
      );

      const new_notify = new SendUpdateEmailNotification();
      user.resetEmailtoken(reset_token);
      user.notify(new_notify);

      delete data.email;

      await App.make(UserRepository).updateOrCreate(data, { id });
    } else {
      await App.make(UserRepository).updateOrCreate(data, { id });
    }
  }

  return user;
}

async function destroy(req, res) {
  const id = req.params.id;
  const repository = new UserRepository();
  const user = await repository.findById(id);
  if (!user) {
    throw new Exception('User not found', 1000);
  }
  await user.destroy();
  res.json(ApiResponse.success());
}

async function attachRole(req, res) {
  const user_id = req.params.user_id;
  const role_id = req.body.role_id;

  const role_user = await App.make(RoleUserRepository)
    .where('user_id', user_id)
    .where('role_id', role_id)
    .first();

  if (role_user) {
    throw new Exception('User already has the role', 1000);
  }

  const result = await App.make(RoleUserRepository).create({ user_id: user_id, role_id: role_id });

  if (!result) {
    throw new Exception('Role is attached to user', 1000);
  }
  res.json(ApiResponse.success());
}

/**
 * Erase all roles of user and attach new roles to user back
 *
 * @param req http request
 * @param res http response
 *
 * @return ApiResponse
 */
async function saveUserRole(req, res) {
  const userId = req.body.user_id;
  const roleIds = req.body.role_ids;
  const roles = await App.make(RoleRepository)
    .whereIn('id', roleIds)
    .get();
  const user = await App.make(UserRepository).findById(userId);

  await App.make(RoleUserRepository)
    .where('user_id', userId)
    .delete();

  for (const role of roles) {
    await user.addRole(role);
  }

  res.json(ApiResponse.success());
}

/**
 * Dettach role from user
 *
 *
 * @return ApiResponse.success
 */

async function dettachRole(req, res) {
  const user_id = req.params.user_id;
  const role_id = req.params.role_id;

  const repository = new RoleUserRepository();

  const role_user = await repository
    .where('user_id', user_id)
    .where('role_id', role_id)
    .first();

  if (!role_user) {
    throw new Exception('Role not found', 1000);
  }

  // const results = await repository.delete({
  //   where: { user_id: user_id, role_id: role_id }
  // });

  const result = await repository
    .where('user_id', user_id)
    .where('role_id', role_id)
    .first();

  await result.destroy();

  if (result === 0) {
    throw new Exception('Delete role Error', 1000);
  }
  res.json(ApiResponse.success());
}

async function getPermissions(req, res) {
  const user_id = req.params.user_id;
  const repository = new UserRepository();
  let permissions = [];
  const user = await repository
    .where('id', user_id)
    .with('role')
    .first();

  if (!user) {
    throw new Exception('User not found', 1000);
  }
  _.forEach(user.roles, item => {
    permissions = permissions.concat(JSON.parse(item.permissions));
  });
  res.json(ApiResponse.array(permissions));
}

/**
 * Get all role of a user
 *
 * @return ApiResponse.array
 */
async function getRoles(req, res) {
  const user_id = req.params.user_id;
  const roles_users = await App.make(RoleUserRepository)
    .orderBy('id', 'DESC')
    .where('user_id', user_id)
    .get();

  if (!roles_users) {
    throw new Exception('User was not attached to any role', 1000);
  }
  res.json(ApiResponse.array(roles_users));
}

module.exports = router;
