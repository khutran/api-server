import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import ApiResponse from '../../../app/Responses/ApiResponse';
import UserTransformer from '../../../app/Transformers/UserTransformer';
import { Auth } from '../../../app/Services/Facades/Auth';
import UserRepository from '../../../app/Repositories/UserRepository';
import { Request } from '../../../app/Services/Facades/Request';
import _ from 'lodash';
import { NotFoundException } from '../../../app/Exceptions/NotFoundException';
import UserPermission from '../../../app/Permission/UserPermission';

const router = express.Router();

router.all('*', AuthMiddleware);

router.get('/', AsyncMiddleware(profile));

/**
 * Show user profile
 *
 * @return ApiResponse.item
 */
async function profile(req, res) {
  await new UserPermission().get().checkPermisson();
  const user = await Auth.user();
  const repository = new UserRepository();
  const transformer = new UserTransformer();
  let query = repository.where('id', user.id);

  if (Request.has('includes')) {
    const includes = _.trim(Request.get('includes')).split(',');
    if (_.includes(includes, 'roles')) {
      query = repository.with('role');
      transformer.with('roles');
    }
  }

  const result = await query.first();
  if (!result) {
    throw new NotFoundException('User');
  }

  res.json(ApiResponse.item(result, transformer));
}

module.exports = router;
