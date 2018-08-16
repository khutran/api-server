import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import ServerRepository from '../../../app/Repositories/ServerRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import HostTransformer from '../../../app/Transformers/HostTransformer';
import { ServerValidator, CREATE_SERVER_RULE, UPDATE_SERVER_RULE } from '../../../app/Validators/ServerValidator';
import { Request } from '../../../app/Services/Facades/Request';
import { App } from '../../../app/Services/App';
import ServerPermission from '../../../app/Permission/ServerPermission';
import ViewPermissionTransformer from '../../../app/Transformers/ViewPermissionTransformer';
const router = express.Router();

router.all('*', AuthMiddleware);
router.get('/view', AsyncMiddleware(view));
router.get('/', AsyncMiddleware(index));
router.post('/list', AsyncMiddleware(list));
router.get('/:id', AsyncMiddleware(show));
router.post('/', AsyncMiddleware(create));
router.put('/:id', AsyncMiddleware(update));
router.delete('/:id', AsyncMiddleware(destroy));

async function view(req, res) {
  const data = {
    view: await new ServerPermission().view().checkView(),
    create: await new ServerPermission().create().checkView(),
    get: await new ServerPermission().get().checkView(),
    update: await new ServerPermission().update().checkView(),
    delete: await new ServerPermission().delete().checkView()
  };

  res.json(ApiResponse.item(data, new ViewPermissionTransformer()));
}

async function index(req, res) {
  await new ServerPermission().get().checkPermisson();
  const repository = new ServerRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name', 'address_mysql', 'ip']);
  repository.applyOrderFromRequest();

  const result = await repository.paginate();

  res.json(ApiResponse.paginate(result, new HostTransformer()));
}

async function list(req, res) {
  await new ServerPermission().get().checkPermisson();
  const repository = new ServerRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name', 'address_mysql', 'ip']);
  repository.applyOrderFromRequest();

  const result = await repository.get();

  res.json(ApiResponse.collection(result, new HostTransformer()));
}

async function show(req, res) {
  await new ServerPermission().get().checkPermisson();
  const id = req.params.id;
  const repository = new ServerRepository();
  const result = await repository.findById(id);
  res.json(ApiResponse.item(result, new HostTransformer()));
}

async function create(req, res) {
  await new ServerPermission().create().checkPermisson();
  ServerValidator.isValid(Request.all(), CREATE_SERVER_RULE);
  const repository = new ServerRepository();
  const result = await repository.create(Request.all());
  res.json(ApiResponse.item(result, new HostTransformer()));
}

async function update(req, res) {
  await new ServerPermission().update().checkPermisson();
  ServerValidator.isValid(Request.all(), UPDATE_SERVER_RULE);
  const repository = new ServerRepository();
  const result = await repository.update(Request.all(), req.params.id);
  res.json(ApiResponse.item(result, new HostTransformer()));
}

async function destroy(req, res) {
  await new ServerPermission().delete().checkPermisson();
  App.make(ServerRepository).deleteById(req.params.id);
  res.json(ApiResponse.success());
}

export default router;
