import models from "../../models";
import { Repository } from "./Repository";

export default class ServerRepository extends Repository {

    Models() {
        return models.build;
    }
}