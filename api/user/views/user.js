import * as _ from "lodash";
import express from "express";
import bcrypt from 'bcrypt-nodejs';
import { asyncMiddleware } from "../../../midlewares/AsyncMiddleware";
import CheckSessionMiddleware from "../../../midlewares/CheckSessionMiddleware";

let router = express.Router();

router.get('/', CheckSessionMiddleware, asyncMiddleware(getPageUser));

async function getPageUser(req, res) {
    let name = req.session.user['last_name'] + req.session.user['first_name'];
    res.render('user', { id: req.session.user['id'], name: name });
}

module.exports = router;