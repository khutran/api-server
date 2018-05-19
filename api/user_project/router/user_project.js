import express from 'express';
import { Exception } from '../../../app/Exceptions/Exception';
import UserProjectRepository from '../../../app/Repositories/UserProjectRepository';
import { asyncMiddleware } from '../../../midlewares/AsyncMiddleware';
import ApiResponse from '../../../app/Responses/ApiResponse';
import UserProjectTransformer from '../../../app/Transformers/UserProjectTransformer';
import AuthMiddleware from '../../../midlewares/AuthMiddleware';
import hasPermission from '../../../midlewares/PermissionMiddleware';
import Permission from '../../../app/Configs/AvailablePermissions';

let router = express.Router();

router.all('*', AuthMiddleware);

router.post('/project', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(add));

async function add(req, res) {
  try {
    let data = {
      user_id: req.body.user_id,
      project_id: req.body.project_id
    };

    let repository = new UserProjectRepository();

    let item = await repository
      .where('user_id', data.user_id)
      .where('project_id', data.project_id)
      .first();

    if (item) {
      throw new Error('project exits', 1000);
    }

    let result = await repository.create(data);

    if (!result) {
      throw new Error('add fasle', 1000);
    }

    res.json(ApiResponse.item(result, new UserProjectTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

module.exports = router;
