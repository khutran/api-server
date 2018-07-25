import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import StatusRepository from '../../../app/Repositories/StatusRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import StatusTransformer from '../../../app/Transformers/StatusTransformer';
import { StatusValidator } from '../../../app/Validators/StatusValidator';
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
  const repository = new StatusRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['seller_email']);
  repository.applyOrderFromRequest();
  const result = await repository.paginate();
  res.json(ApiResponse.paginate(result, new StatusTransformer()));
}

async function show(req, res) {
  const id = req.params.id;
  const repository = new StatusRepository();
  const result = await repository.findById(id);
  res.json(ApiResponse.item(result, new StatusTransformer()));
}

async function create(req, res) {
  StatusValidator.isValid(Request.all(), 'CREATE_RULE');
  const repository = new StatusRepository();
  const result = await repository.create(Request.all());
  res.json(ApiResponse.item(result, new StatusTransformer()));
}

async function update(req, res) {
  StatusValidator.isValid(Request.all(), 'UPDATE_RULE');
  const repository = new StatusRepository();
  const result = await repository.update(Request.all(), req.params.id);
  res.json(ApiResponse.item(result, new StatusTransformer()));
}

async function destroy(req, res) {
  App.make(StatusRepository).deleteById(req.params.id);
  res.json(ApiResponse.success());
}

export default router;
