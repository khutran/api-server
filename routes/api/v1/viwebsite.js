import * as _ from 'lodash';
import express from 'express';
import jwt from 'jsonwebtoken';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import moment from 'moment';
import { SendForgotPasswordNotification } from '../../../app/Notifications/SendForgotPasswordNotification';
import { SendWelcomeEmailNotification } from '../../../app/Notifications/SendWelcomeEmailNotification';
import { App } from '../../../app/Services/App';
import UserRepository from '../../../app/Repositories/UserRepository';
import ForgotPasswordRepository from '../../../app/Repositories/ForgotPasswordRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import RoleRepository from '../../../app/Repositories/RoleRepository';
import { NotFoundException } from '../../../app/Exceptions/NotFoundException';
import { Exception } from '../../../app/Exceptions/Exception';
import { NotFoundHttpException } from '../../../app/Exceptions/NotFoundHttpException';
import { AuthValidator, REGISTER_RULE } from '../../../app/Validators/AuthValidator';
import { Request } from '../../../app/Services/Facades/Request';
import PasswordUtil from '../../../app/Utils/PasswordUtil';
import randomstring from 'randomstring';

const router = express.Router();

router.post('/login', AsyncMiddleware(login));
router.post('/register', AsyncMiddleware(register));
router.post('/forgot-password', AsyncMiddleware(forgotpassword));
router.post('/reset-password', AsyncMiddleware(resetpassword));
router.get('/exists/:email', AsyncMiddleware(customerExist));

async function customerExist(req, res) {
  const email = req.params.email;

  const user = await App.make(UserRepository)
    .where('email', email)
    .first();

  let status = 'NOT_EXISTS';

  if (user) {
    if (user.last_login) {
      status = 'LOGGED_IN';
    } else {
      status = 'NEVER_LOGGED_IN';
    }
  }

  res.json({ status });
}

async function login(req, res) {
  const email = req.body.email;
  const repository = new UserRepository();
  const user = await repository.where('email', email).first();

  if (!user) {
    throw new NotFoundException('User');
  }

  // const isValidPassword = new PasswordUtil(user.password_type).compare(password, user.password);

  // if (isValidPassword === false) {
  //   throw new Exception('Password does not match', 4003);
  // }

  // await user.update({ last_login: new Date() });

  const access_token = jwt.sign(
    {
      data: user
    },
    process.env.JWT_SECRET,
    { expiresIn: 20160000 }
  );

  res.json({ access_token: access_token });
}

async function register(req, res) {
  // AuthValidator.isValid(Request.all(), REGISTER_RULE);

  const new_user = {
    email: req.body.email,
    password: new PasswordUtil().encrypt(randomstring.generate(8)),
    last_password_updated: moment().toISOString(),
    password_type: PasswordUtil.DEFAULT_PASSWORD,
    status: req.body.status || 0,
    first_name: 'default',
    last_name: 'default'
  };

  const checkUser = await App.make(UserRepository)
    .where('email', new_user.email)
    .first();

  if (checkUser) {
    throw new Exception('User already exists', 4004);
  }
  const user = await App.make(UserRepository).create(new_user);

  const customerRole = await App.make(RoleRepository)
    .where('slug', 'customer')
    .first();
  await user.addRole(customerRole);
  const sendMail = new SendWelcomeEmailNotification();

  user.notify(sendMail);
  const profile = _.pick(user, ['email', 'status', 'last_password_updated']);

  const access_token = jwt.sign(
    {
      data: profile
    },
    process.env.JWT_SECRET,
    { expiresIn: 20160000 }
  );

  res.json({ access_token: access_token });
}

async function forgotpassword(req, res) {
  const email = req.body.email;

  const new_notify = new SendForgotPasswordNotification();

  const repository = new UserRepository();

  const user = await repository
    .where('email', email)
    .with('forgot_password')
    .first();

  if (!user) {
    throw new NotFoundException('User');
  }

  const profile = _.pick(user, ['email', 'image', 'status']);

  const reset_token = jwt.sign(
    {
      data: profile
    },
    process.env.JWT_SECRET,
    { expiresIn: 20160000 }
  );

  if (!user.forgot_password) {
    await App.make(ForgotPasswordRepository).create({
      user_id: user.id,
      email: user.email,
      token: reset_token,
      status: 1
    });
  } else {
    await user.forgot_password.update({
      user_id: user.id,
      email: user.email,
      token: reset_token,
      status: 1
    });
  }
  user.resetPasstoken(reset_token);
  user.notify(new_notify);

  res.json(ApiResponse.success());
}

async function resetpassword(req, res) {
  const reset_token = req.body.token;
  const password = new PasswordUtil().encrypt(req.body.password);

  const update_pass = {
    password: password,
    last_password_updated: moment().toISOString()
  };

  const verify = await jwt.verify(reset_token, process.env.JWT_SECRET);

  if (!verify) {
    throw new Exception('Token invalid', 4002);
  }

  const repository = new UserRepository();
  const user = await repository
    .where('email', verify.data.email)
    .with('forgot_password')
    .first();

  if (!user.forgot_password) {
    throw new NotFoundHttpException('User');
  } else if (user.forgot_password.status !== 1) {
    throw new Exception('Token invalid', 4002);
  }

  await user.update(update_pass);
  await user.forgot_password.update({ status: 0 });

  res.json(ApiResponse.success());
}

module.exports = router;
