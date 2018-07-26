import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import CategoryRepository from '../../../app/Repositories/CategoryRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import CategoryTransformer from '../../../app/Transformers/CategoryTransformer';
import { CategoryValidator, CREATE_CATEGORY_RULE, UPDATE_CATEGORY_RULE } from '../../../app/Validators/CategoryValidator';
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
  const repository = new CategoryRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name']);
  repository.applyOrderFromRequest();

  const result = await repository.paginate();

  res.json(ApiResponse.paginate(result, new CategoryTransformer()));
}

async function show(req, res) {
  const id = req.params.id;
  const repository = new CategoryRepository();
  const result = await repository.findById(id);
  res.json(ApiResponse.item(result, new CategoryTransformer()));
}

async function create(req, res) {
  CategoryValidator.isValid(Request.all(), CREATE_CATEGORY_RULE);
  const repository = new CategoryRepository();
  const result = await repository.create(Request.all());
  res.json(ApiResponse.item(result, new CategoryTransformer()));
}

async function update(req, res) {
  CategoryValidator.isValid(Request.all(), UPDATE_CATEGORY_RULE);
  const repository = new CategoryRepository();
  const result = await repository.update(Request.all(), req.params.id);
  res.json(ApiResponse.item(result, new CategoryTransformer()));
}

async function destroy(req, res) {
  App.make(CategoryRepository).deleteById(req.params.id);
  res.json(ApiResponse.success());
}

export default router;
