import express from 'express';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import PermissionRepository from '../../../app/Repositories/PermissionRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import PermissionsTranformer from '../../../app/Transformers/PermissionTransformer';
import PermissionGroupRepository from '../../../app/Repositories/PermissionGroupRepository';
import PermissionGroupTransformer from '../../../app/Transformers/PermissionGroupTransformer';
import { App } from '../../../app/Services/App';
import PermissionPermission from '../../../app/Permission/PermissionPermission';
import ViewPermissionTransformer from '../../../app/Transformers/ViewPermissionTransformer';
let router = express.Router();

// router.all('*', AuthMiddleware);

router.all('*', AuthMiddleware);
router.get('/view', AsyncMiddleware(view));
router.get('/group', AsyncMiddleware(group));
router.post('/list', AsyncMiddleware(list));

async function view(req, res) {
  const data = {
    view: await new PermissionPermission().view().checkView(),
    create: await new PermissionPermission().create().checkView(),
    get: await new PermissionPermission().get().checkView(),
    update: await new PermissionPermission().update().checkView(),
    delete: await new PermissionPermission().delete().checkView()
  };

  res.json(ApiResponse.item(data, new ViewPermissionTransformer()));
}

async function list(req, res) {
  await new PermissionPermission().get().checkPermisson();
  const repository = new PermissionRepository();
  repository.applyConstraintsFromRequest();
  repository.applySearchFromRequest(['name', 'slug']);
  repository.applyOrderFromRequest();

  const result = await repository.get();

  res.json(ApiResponse.collection(result, new PermissionsTranformer()));
}

async function group(req, res) {
  await new PermissionPermission().get().checkPermisson();
  let result = await App.make(PermissionGroupRepository)
    .with('permission')
    .get();
  res.json(ApiResponse.collection(result, new PermissionGroupTransformer(['permissions'])));
}

module.exports = router;
