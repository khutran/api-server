import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import ProjectRepository from '../../../app/Repositories/ProjectRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import ProjectTransformer from '../../../app/Transformers/ProjectTransformer';
import { Request } from '../../../app/Services/Facades/Request';
import { App } from '../../../app/Services/App';
import { ProjectValidator, CREATE_PROJECT_RULE, UPDATE_PROJECT_RULE } from '../../../app/Validators/ProjectValidator';
import StatusRepository from '../../../app/Repositories/StatusRepository';
import CategoryRepository from '../../../app/Repositories/CategoryRepository';
import FrameworkRepository from '../../../app/Repositories/FrameWorkRepository';
import CsdlRepository from '../../../app/Repositories/CsdlRepository';
import ServerRepository from '../../../app/Repositories/ServerRepository';
import { Exception } from '../../../app/Exceptions/Exception';
import { Auth } from '../../../app/Services/Facades/Auth';
import * as _ from 'lodash';
import ProjectPermission from '../../../app/Permission/ProjectPermission';
import ViewPermissionTransformer from '../../../app/Transformers/ViewPermissionTransformer';
const router = express.Router();

router.all('*', AuthMiddleware);
router.get('/view', AsyncMiddleware(view));
router.get('/', AsyncMiddleware(index));
router.get('/:id', AsyncMiddleware(show));
router.post('/', AsyncMiddleware(create));
router.put('/:id', AsyncMiddleware(update));
router.delete('/:id', AsyncMiddleware(destroy));
router.get('/:id/user', AsyncMiddleware(litUser));

async function view(req, res) {
  const data = {
    view: await new ProjectPermission().view().checkView(),
    create: await new ProjectPermission().create().checkView(),
    get: await new ProjectPermission().get().checkView(),
    update: await new ProjectPermission().update().checkView(),
    delete: await new ProjectPermission().delete().checkView()
  };

  res.json(ApiResponse.item(data, new ViewPermissionTransformer()));
}

async function litUser(req, res) {
  // await new ProjectPermission().get().checkPermisson();
  const id = req.params.id;
  const repository = new ProjectRepository();
  const result = await repository.withScope('listUser-Scope').findById(id);
  res.json(ApiResponse.item(result, new ProjectTransformer(['users'])));
}

async function index(req, res) {
  // await new ProjectPermission().get().checkPermisson();
  const repository = new ProjectRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name', 'database', 'git_remote', 'git_branch', 'git_application_key', 'git_application_secret']);
  repository.applyOrderFromRequest();
  const user = Auth.user();

  if (!(await user.isAdmin())) {
    repository.whereHas('user', function(q) {
      q.where('id', Auth.id());
      return q;
    });
  }

  const result = await repository.paginate();
  res.json(ApiResponse.paginate(result, new ProjectTransformer(['status', 'host', 'framework', 'csdl', 'categories'])));
}

async function show(req, res) {
  // await new ProjectPermission().get().checkPermisson();
  const id = req.params.id;
  const repository = new ProjectRepository();
  const result = await repository.findById(id);
  res.json(ApiResponse.item(result, new ProjectTransformer(['status', 'host', 'framework', 'csdl', 'categories'])));
}

async function create(req, res) {
  // await new ProjectPermission().create().checkPermisson();
  ProjectValidator.isValid(Request.all(), CREATE_PROJECT_RULE);
  const status = await App.make(StatusRepository).findById(Request.get('status_id'));
  const category = await App.make(CategoryRepository).findById(Request.get('category_id'));
  const framework = await App.make(FrameworkRepository).findById(Request.get('framework_id'));
  const sql_manager = await App.make(CsdlRepository).findById(Request.get('csdl_id'));
  const server = await App.make(ServerRepository).findById(Request.get('server_id'));
  const repository = new ProjectRepository();
  const item = await repository.where('name', req.body.name).first();
  if (item) {
    throw new Exception('Project exitst', 4008);
  }
  const project = await repository.create(Request.all());
  await project.setStatus(status);
  await project.setCategories(category);
  await project.setFramework(framework);
  await project.setCsdl(sql_manager);
  await project.setHost(server);
  res.json(ApiResponse.item(project, new ProjectTransformer()));
}

async function update(req, res) {
  // await new ProjectPermission().update().checkPermisson();
  ProjectValidator.isValid(Request.all(), UPDATE_PROJECT_RULE);
  console.log(req.body);
  const status = await App.make(StatusRepository).findById(Request.get('status_id'));
  const category = await App.make(CategoryRepository).findById(Request.get('category_id'));
  const framework = await App.make(FrameworkRepository).findById(Request.get('framework_id'));
  const server = await App.make(ServerRepository).findById(Request.get('server_id'));

  const repository = new ProjectRepository();
  const project = await repository.update(Request.all(), req.params.id);
  if (!_.isNil(Request.get('csdl_id'))) {
    const sql_manager = await App.make(CsdlRepository).findById(Request.get('csdl_id'));
    await project.setCsdl(sql_manager);
  }
  await project.setStatus(status);
  await project.setCategories(category);
  await project.setFramework(framework);

  await project.setHost(server);
  res.json(ApiResponse.item(project, new ProjectTransformer()));
}

async function destroy(req, res) {
  // await new ProjectPermission().delete().checkPermisson();
  const id = req.params.id;
  App.make(ProjectRepository).deleteById(id);
  res.json(ApiResponse.success());
}

export default router;
