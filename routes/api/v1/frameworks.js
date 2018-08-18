import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import FrameWorkRepository from '../../../app/Repositories/FrameWorkRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import FrameworkTransformer from '../../../app/Transformers/FrameworkTransformer';
import { FrameworkValidator, CREATE_FRAMEWORK_RULE, UPDATE_FRAMEWORK_RULE } from '../../../app/Validators/FrameworkValidator';
import { Request } from '../../../app/Services/Facades/Request';
import { App } from '../../../app/Services/App';
import FrameworkPermission from '../../../app/Permission/FrameworkPermission';
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
    view: await new FrameworkPermission().view().checkView(),
    create: await new FrameworkPermission().create().checkView(),
    get: await new FrameworkPermission().get().checkView(),
    update: await new FrameworkPermission().update().checkView(),
    delete: await new FrameworkPermission().delete().checkView()
  };

  res.json(ApiResponse.item(data, new ViewPermissionTransformer()));
}

async function index(req, res) {
  await new FrameworkPermission().get().checkPermisson();
  const repository = new FrameWorkRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name']);
  repository.applyOrderFromRequest();
  const result = await repository.paginate();
  res.json(ApiResponse.paginate(result, new FrameworkTransformer()));
}

async function list(req, res) {
  await new FrameworkPermission().get().checkPermisson();
  const repository = new FrameWorkRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name']);
  repository.applyOrderFromRequest();
  const result = await repository.get();
  res.json(ApiResponse.collection(result, new FrameworkTransformer()));
}

async function show(req, res) {
  await new FrameworkPermission().get().checkPermisson();
  const id = req.params.id;
  const repository = new FrameWorkRepository();
  const result = await repository.findById(id);
  res.json(ApiResponse.item(result, new FrameworkTransformer()));
}

async function create(req, res) {
  await new FrameworkPermission().create().checkPermisson();
  FrameworkValidator.isValid(Request.all(), CREATE_FRAMEWORK_RULE);
  const repository = new FrameWorkRepository();
  const result = await repository.create(Request.all());
  res.json(ApiResponse.item(result, new FrameworkTransformer()));
}

async function update(req, res) {
  await new FrameworkPermission().update().checkPermisson();
  FrameworkValidator.isValid(Request.all(), UPDATE_FRAMEWORK_RULE);
  const repository = new FrameWorkRepository();
  const result = await repository.update(Request.all(), req.params.id);
  res.json(ApiResponse.item(result, new FrameworkTransformer()));
}

async function destroy(req, res) {
  await new FrameworkPermission().delete().checkPermisson();
  App.make(FrameWorkRepository).deleteById(req.params.id);
  res.json(ApiResponse.success());
}

export default router;
