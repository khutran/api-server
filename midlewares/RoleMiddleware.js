import * as _ from "lodash";
import { asyncMiddleware } from "./AsyncMiddleware";
import { Exception } from "../app/Exceptions/Exception";
import { Auth } from "../app/Services/Facades/Auth";

const isRole = async (req, res, next) => {
    let results = await Auth.user().isRole(this);

    if (results === true) {
        next();
    } else {
        res.status(500);
        res.json({ message: "User not is role", error_code: 500 });
    }
};

export default isRole;
