import * as _ from 'lodash';
import models from "../../models";
import { Exception } from "../Exceptions/Exception";
import { Repository } from "./Repository";

export default class ProjectRepository extends Repository {

    Models() {
        return models.project;
    }
}