import * as _ from "lodash";
require("dotenv").config();
import { asyncMiddleware } from "./AsyncMiddleware";
import Error from "../app/Exceptions/CustomsError";

const sessionChecker = asyncMiddleware(async(req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        next();
    } else {
        res.redirect("/login");
    }
});

module.exports = sessionChecker;