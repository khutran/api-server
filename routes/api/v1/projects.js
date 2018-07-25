import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import ProjectRepository from '../../../app/Repositories/ProjectRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import ProjectTransformer from '../../../app/Transformers/ProjectTransformer';
import { Request } from '../../../app/Services/Facades/Request';
import { App } from '../../../app/Services/App';
import { ProjectValidator, CREATE_PROJECT_RULE, UPDATE_PROJECT_RULE } from '../../../app/Validators/ProjectValidator';

const router = express.Router();

router.all('*', AuthMiddleware);
router.get('/', AsyncMiddleware(index));
router.get('/:id', AsyncMiddleware(show));
router.post('/', AsyncMiddleware(create));
router.put('/:id', AsyncMiddleware(update));
router.delete('/:id', AsyncMiddleware(destroy));

async function index(req, res) {
  const repository = new ProjectRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['seller_email']);
  repository.applyOrderFromRequest();
  const result = await repository.paginate();
  res.json(ApiResponse.paginate(result, new ProjectTransformer(['status', 'build', 'framework', 'csdl', 'categories'])));
}

async function show(req, res) {
  const id = req.params.id;
  const repository = new ProjectRepository();
  const result = await repository.findById(id);
  res.json(ApiResponse.item(result, new ProjectTransformer(['status', 'build', 'framework', 'csdl', 'categories'])));
}

async function create(req, res) {
  ProjectValidator.isValid(Request.all(), CREATE_PROJECT_RULE);
  const repository = new ProjectRepository();
  const result = await repository.create(Request.all());
  res.json(ApiResponse.item(result, new ProjectTransformer()));
}

async function update(req, res) {
  ProjectValidator.isValid(Request.all(), UPDATE_PROJECT_RULE);
  const repository = new ProjectRepository();
  const result = await repository.update(Request.all(), req.params.id);
  res.json(ApiResponse.item(result, new ProjectTransformer()));
}

async function destroy(req, res) {
  App.make(ProjectRepository).deleteById(req.params.id);
  res.json(ApiResponse.success());
}

export default router;
