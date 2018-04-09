import * as _ from "lodash";
import express from "express";
import bcrypt from 'bcrypt-nodejs';
import { Exception } from '../../../app/Exceptions/Exception';
import UserRepository from '../../../app/Repositories/UserRepository';
import { asyncMiddleware } from "../../../midlewares/AsyncMiddleware";
import CheckSessionMiddleware from "../../../midlewares/CheckSessionMiddleware";
import SingletonService from "../../../app/Services/SingletonService";
import { Request } from "../../../app/Request";
import hasPermission from "../../../midlewares/PermissionMiddleware";
import AvailablePermissions from "../../../app/Configs/AvailablePermissions";

let router = express.Router();

router.get('/', CheckSessionMiddleware, hasPermission.bind(AvailablePermissions.ADMIN_VIEW), asyncMiddleware(getAdmin));
router.get('/project', CheckSessionMiddleware, hasPermission.bind(AvailablePermissions.ADMIN_VIEW), asyncMiddleware(getAdminProject));
router.get('/user', CheckSessionMiddleware, hasPermission.bind(AvailablePermissions.ADMIN_VIEW), asyncMiddleware(getAdminServer));
router.get('/server', CheckSessionMiddleware, hasPermission.bind(AvailablePermissions.ADMIN_VIEW), asyncMiddleware(getAdminUser));

async function getAdmin(req, res) {
    let name = req.session.user['last_name'] + req.session.user['first_name'];
    res.render('admin', { name: name });
}

async function getAdminProject(req, res) {
    let name = req.session.user['last_name'] + req.session.user['first_name'];
    res.render('admin-project', { name: name });
}

async function getAdminServer(req, res) {
    let name = req.session.user['last_name'] + req.session.user['first_name'];
    res.render('admin-server', { name: name });
}

async function getAdminUser(req, res) {
    let name = req.session.user['last_name'] + req.session.user['first_name'];
    res.render('admin-user', { name: name });
}
module.exports = router;