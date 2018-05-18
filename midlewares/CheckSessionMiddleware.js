import { asyncMiddleware } from './AsyncMiddleware';
require('dotenv').config();

const sessionChecker = asyncMiddleware(async (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    next();
  } else {
    res.redirect('/login');
  }
});

module.exports = sessionChecker;
