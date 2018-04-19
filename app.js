import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from "express-session";
import AppRouter from './api';
import { ExceptionHandler } from './app/Exceptions/ExceptionHandler';
var cors = require('cors');

require('dotenv').config();

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.use(
    "/socket.io",
    express.static(__dirname + "/node_modules/socket.io-client/dist/")
);
app.use(
    "/angular",
    express.static(__dirname + "/node_modules/angular/")
);
app.use(
    "/lodash",
    express.static(__dirname + "/node_modules/lodash/")
);
app.use(
    "/assets",
    express.static(__dirname + "/assets")
);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));
// app.use(session({
//     key: 'user_sid',
//     secret: 'somerandonstuffs',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         expires: 60000000
//     }
// }));

// app.use((req, res, next) => {
//     if (req.cookies.user_sid && !req.session.user) {
//         res.clearCookie('user_sid');
//     }
//     next();
// });

app.use(AppRouter);
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
