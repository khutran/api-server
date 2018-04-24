import * as _ from "lodash";
import { asyncMiddleware } from "./AsyncMiddleware";
import { Exception } from "../app/Exceptions/Exception";
import SingletonService from "../app/Services/SingletonService";

async function hasPermission(req, res, next) {
    const singleton = new SingletonService();
    let user = singleton.getUserLogin(req.me);
    let bool = false;
    _.forEach(user.roles, (item) => {
        if (item.permissions.indexOf(this) > -1) {
            bool = true;
        }
    });

    if (bool === true) {
        next();
    } else {
        res.status(500);
        res.json({ message: "Permission denied", error_code: 403 });
    }
};

export default hasPermission;