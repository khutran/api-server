import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import ServerRepository from '../../../app/Repositories/ServerRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import HostTransformer from '../../../app/Transformers/HostTransformer';
import { ServerValidator, CREATE_SERVER_RULE, UPDATE_SERVER_RULE } from '../../../app/Validators/ServerValidator';
import { Request } from '../../../app/Services/Facades/Request';
import { App } from '../../../app/Services/App';

const router = express.Router();

router.all('*', AuthMiddleware);
router.get('/', AsyncMiddleware(index));
router.get('/:id', AsyncMiddleware(show));
router.post('/', AsyncMiddleware(create));
router.put('/:id', AsyncMiddleware(update));
router.delete('/:id', AsyncMiddleware(destroy));

async function index(req, res) {
  const repository = new ServerRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name', 'address_mysql', 'ip']);
  repository.applyOrderFromRequest();

  const result = await repository.paginate();

  res.json(ApiResponse.paginate(result, new HostTransformer()));
}

async function show(req, res) {
  const id = req.params.id;
  const repository = new ServerRepository();
  const result = await repository.findById(id);
  res.json(ApiResponse.item(result, new HostTransformer()));
}

async function create(req, res) {
  ServerValidator.isValid(Request.all(), CREATE_SERVER_RULE);
  const repository = new ServerRepository();
  const result = await repository.create(Request.all());
  res.json(ApiResponse.item(result, new HostTransformer()));
}

async function update(req, res) {
  ServerValidator.isValid(Request.all(), UPDATE_SERVER_RULE);
  const repository = new ServerRepository();
  const result = await repository.update(Request.all(), req.params.id);
  res.json(ApiResponse.item(result, new HostTransformer()));
}

async function destroy(req, res) {
  App.make(ServerRepository).deleteById(req.params.id);
  res.json(ApiResponse.success());
}

export default router;
