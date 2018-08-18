import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import ApiRouter from './routes';
import { ExceptionHandler } from './app/Exceptions/exceptionHandler';
import { App } from './app/Services/App';
import { Exception } from './app/Exceptions/Exception';
import { Request } from './app/Services/Facades/Request';
// import cors from 'cors';

require('dotenv').config();

var app = express();

// console.log(process.env.IS_USE_LOCAL_CORS);

// if (process.env.IS_USE_LOCAL_CORS === 'true') {
//   var corsOptions = {
//     origin: 'http://localhost:5002',
//     optionsSuccessStatus: 200
//   };
//   app.use(cors(corsOptions));
// }

// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "hbs");

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

App.resolveAppProviders();

app.use(function(req, res, next) {
  const reqd = Request.createFromRequest(req, res, next);
  reqd.add(req);
  reqd.add(res);
  reqd._req = req;
  reqd.run(next);
});

app.use(ApiRouter);

app.use(ExceptionHandler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  // res.render("error");
  throw new Exception(err.message, 404);
});

module.exports = app;
