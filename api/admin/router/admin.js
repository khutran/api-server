import * as _ from "lodash";
import express from "express";
import bcrypt from 'bcrypt-nodejs';
import { Exception } from '../../../app/Exceptions/Exception';
import UserRepository from '../../../app/Repositories/UserRepository';
import { asyncMiddleware } from "../../../midlewares/AsyncMiddleware";
import CheckSessionMiddleware from "../../../midlewares/CheckSessionMiddleware";
import SingletonService from "../../../app/Services/SingletonService";
import { Request } from "../../../app/Request";

let router = express.Router();


module.exports = router;