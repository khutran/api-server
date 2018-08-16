import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import StatusRepository from '../../../app/Repositories/StatusRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import StatusTransformer from '../../../app/Transformers/StatusTransformer';
import { StatusValidator, UPDATE_STATUS_RULE, CREATE_STATUS_RULE } from '../../../app/Validators/StatusValidator';
import { Request } from '../../../app/Services/Facades/Request';
import { App } from '../../../app/Services/App';
import StatusPermission from '../../../app/Permission/StatusPermission';

const router = express.Router();

router.all('*', AuthMiddleware);
router.get('/', AsyncMiddleware(index));
router.post('/list', AsyncMiddleware(list));
router.get('/:id', AsyncMiddleware(show));
router.post('/', AsyncMiddleware(create));
router.put('/:id', AsyncMiddleware(update));
router.delete('/:id', AsyncMiddleware(destroy));

async function index(req, res) {
  await new StatusPermission().get();
  const repository = new StatusRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name']);
  repository.applyOrderFromRequest();
  const result = await repository.paginate();
  res.json(ApiResponse.paginate(result, new StatusTransformer()));
}

async function list(req, res) {
  await new StatusPermission().get();
  const repository = new StatusRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name']);
  repository.applyOrderFromRequest();
  const result = await repository.get();
  res.json(ApiResponse.collection(result, new StatusTransformer()));
}

async function show(req, res) {
  await new StatusPermission().get();
  const id = req.params.id;
  const repository = new StatusRepository();
  const result = await repository.findById(id);
  res.json(ApiResponse.item(result, new StatusTransformer()));
}

async function create(req, res) {
  await new StatusPermission().create();
  StatusValidator.isValid(Request.all(), CREATE_STATUS_RULE);
  const repository = new StatusRepository();
  const result = await repository.create(Request.all());
  res.json(ApiResponse.item(result, new StatusTransformer()));
}

async function update(req, res) {
  await new StatusPermission().update();
  StatusValidator.isValid(Request.all(), UPDATE_STATUS_RULE);
  const repository = new StatusRepository();
  const result = await repository.update(Request.all(), req.params.id);
  res.json(ApiResponse.item(result, new StatusTransformer()));
}

async function destroy(req, res) {
  await new StatusPermission().delete();
  App.make(StatusRepository).deleteById(req.params.id);
  res.json(ApiResponse.success());
}

export default router;
