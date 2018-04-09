import * as _ from "lodash";
import express from "express";
import bcrypt from 'bcrypt-nodejs';
import { Exception } from '../../../app/Exceptions/Exception';
import { asyncMiddleware } from "../../../midlewares/AsyncMiddleware";
import CheckSessionMiddleware from "../../../midlewares/CheckSessionMiddleware";

let router = express.Router();

router.get('/', asyncMiddleware(getLogin));

async function getLogin(req, res) {
    if (req.session.user && req.cookies.user_sid) {
        return res.redirect("/user");
    }
    
    res.render('login');
}

module.exports = router;