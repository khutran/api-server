import { asyncMiddleware } from './AsyncMiddleware';
import jwt from 'jsonwebtoken';
import { Exception } from '../app/Exceptions/Exception';
import _ from 'lodash';
import SingletonService from '../app/Services/SingletonService';

const auth = asyncMiddleware(async (req, res, next) => {
  try {
    let authorization = req.headers.authorization;
    if (!authorization) {
      throw new Exception('Token not found', 304);
    }
    let access_token = authorization.split(' ')[1];

    if (_.isNil(access_token)) {
      throw new Exception('Token not found', 304);
    }

    let decoded = await jwt.verify(access_token, process.env.JWT_SECRET);

    if (!decoded) {
      throw new Exception('Token invalid', 304);
    }

    let single = new SingletonService();
    let user = single.getUserLogin(decoded.data.id);

    if (_.isNil(user)) {
      throw new Error('User not login', 304);
    }

    if (!_.isEqual(user.last_password_updated, decoded.data.last_password_updated)) {
      throw new Error('user has changed password', 304);
    }

    if (!_.isEqual(user.last_login, decoded.data.last_login)) {
      throw new Error('The user has already logged in', 304);
    }

    req.me = user.id;
    next();
  } catch (e) {
    throw new Exception(e.message, 304);
  }
});

module.exports = auth;
