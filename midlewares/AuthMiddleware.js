import { asyncMiddleware } from './AsyncMiddleware';
import jwt from 'jsonwebtoken';
import { Exception } from '../app/Exceptions/Exception';
import _ from 'lodash';

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

    console.log(decoded.data)
    if (decoded.data.last_password_updated !== req.session.user.last_password_updated) {
      throw new Exception('Token is expired', 4006);
    }

    next();
  } catch (e) {
    throw new Exception(e.message, e.code);
  }
});

module.exports = auth;