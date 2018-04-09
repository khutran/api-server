import * as _ from 'lodash';
import models from "../../models";
import { Exception } from "../Exceptions/Exception";
import { Repository } from "./Repository";

export default class UserRepository extends Repository {

    Models() {
        return models.user;
    }
}