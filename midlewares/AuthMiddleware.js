import { asyncMiddleware } from './AsyncMiddleware';
import jwt from 'jsonwebtoken';
import { Exception } from '../app/Exceptions/Exception';
import _ from 'lodash';
import SingletonService from "../app/Services/SingletonService";
import { decode } from 'punycode';

const auth = asyncMiddleware(async (req, res, next) => {
  try {

    let authorization = req.headers.authorization;

    if (!authorization) {
      throw new Exception('Token not found', 1000);
    }
    let access_token = authorization.split(' ')[1];

    if (_.isNil(access_token)) {
      throw new Exception('Token not found', 1000);
    }

    let decoded = await jwt.verify(access_token, process.env.JWT_SECRET);

    if (!decoded) {
      throw new Exception('Token invalid', 4002);
    }

    let single = new SingletonService();
    let user = single.getUserLogin(decoded.data.id);

    if(_.isNil(user)){
      throw new Error('User not login', 1000);
    }

    if(!_.isEqual(user.last_password_updated, decoded.data.last_password_updated)){
      throw new Error('user has changed password', 1000);
    }

    if(!_.isEqual(user.last_login, decoded.data.last_login)){
      throw new Error('The user has already logged in', 1000);
    }

    req.me = user.id;
    next();
  } catch (e) {
    throw new Exception(e.message, e.code);
  }
});

module.exports = auth;