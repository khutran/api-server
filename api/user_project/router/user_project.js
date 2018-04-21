import * as _ from 'lodash';
import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import { Exception } from '../../../app/Exceptions/Exception';
import UserProjectRepository from '../../../app/Repositories/UserProjectRepository';
import { asyncMiddleware } from '../../../midlewares/AsyncMiddleware';
import CheckSessionMiddleware from '../../../midlewares/CheckSessionMiddleware';
import ApiResponse from '../../../app/Responses/ApiResponse';
import UserProjectTransformer from '../../../app/Transformers/UserProjectTransformer';
import AuthMiddleware from '../../../midlewares/AuthMiddleware';
import SingletonService from "../../../app/Services/SingletonService";

let router = express.Router();

router.all('*', AuthMiddleware);

router.post('/project', asyncMiddleware(add));

async function add(req, res){
  let data = {
    user_id: req.body.user_id,
    project_id: req.body.project_id
  }

  let repository = new UserProjectRepository();

  let item = await repository
    .where('user_id', data.user_id)
    .where('project_id', data.project_id)
    .first();

  if(item){
    throw new Error('project exits', 1000);
  }

  let result = await repository.create(data);

  if(!result){
    throw new Error('add fasle', 1000);
  }

  res.json(ApiResponse.item(result, new UserProjectTransformer()));
}

module.exports = router;