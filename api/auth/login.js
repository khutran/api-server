import * as _ from 'lodash';
import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import { Exception } from '../../app/Exceptions/Exception';
import Error from '../../app/Exceptions/CustomsError';
import UserRepository from '../../app/Repositories/UserRepository';
import { asyncMiddleware } from '../../midlewares/AsyncMiddleware';
import SingletonService from '../../app/Services/SingletonService';
import moment from 'moment';

let router = express.Router();

router.post('/', asyncMiddleware(Login));

async function Login(req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let repository = new UserRepository();
    let user = await repository
      .withScope('scopeRole-Project')
      .where('email', email)
      .first();

    if (!user) {
      throw new Error('User not Found', 204);
    }

    let is_valid = await bcrypt.compareSync(password, user.password);

    if (is_valid === false) {
      throw new Error('Password false', 204);
    }

    user = await user.update({ last_login: moment().toISOString() });
    await user.reload();
    let me = _.pick(user, ['id', 'email', 'status', 'first_name', 'last_name', 'last_password_updated', 'last_login', 'roles']);
    const singleton = new SingletonService();
    let profile = {};
    profile[me.id] = me;
    singleton.UserLogin(profile);

    let access_token = jwt.sign(
      {
        data: me
      },
      process.env.JWT_SECRET,
      { expiresIn: 20160000 }
    );
    res.json({ access_token: access_token });
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

module.exports = router;
