import express from 'express';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import PermissionRepository from '../../../app/Repositories/PermissionRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import PermissionsTranformer from '../../../app/Transformers/PermissionTransformer';
import PermissionGroupRepository from '../../../app/Repositories/PermissionGroupRepository';
import PermissionGroupTransformer from '../../../app/Transformers/PermissionGroupTransformer';
import { App } from '../../../app/Services/App';
let router = express.Router();

router.all('*', AuthMiddleware);

router.all('*', AuthMiddleware);
router.get('/group', AsyncMiddleware(group));
router.post('/list', AsyncMiddleware(list));

async function list(req, res) {
  const repository = new PermissionRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name', 'slug']);
  repository.applyOrderFromRequest();

  const result = await repository.get();

  res.json(ApiResponse.collection(result, new PermissionsTranformer()));
}

async function group(req, res) {
  let result = await App.make(PermissionGroupRepository)
    .with('permission')
    .get();
  res.json(ApiResponse.collection(result, new PermissionGroupTransformer(['permissions'])));
}

module.exports = router;
