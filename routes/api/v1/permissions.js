import express from 'express';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import PermissionRepository from '../../../app/Repositories/PermissionRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
// import { PermissionValidator } from '../../../app/Validators/PermissionValidator';
// import Request from '../../../app/Services/Request';
// import { App } from '../../../app/Services/App';
import PermissionsTranformer from '../../../app/Transformers/PermissionsTransformer';

let router = express.Router();

router.all('*', AuthMiddleware);

router.all('*', AuthMiddleware);
router.post('/list', AsyncMiddleware(list));

async function list(req, res) {
  const repository = new PermissionRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name', 'slug']);
  repository.applyOrderFromRequest();

  const result = await repository.get();

  res.json(ApiResponse.collection(result, new PermissionsTranformer()));
}

module.exports = router;
