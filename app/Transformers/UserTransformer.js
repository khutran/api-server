import Transformer from "./Transformer";
import ProjectTransformer from "./ProjectTransformer";
import StatusTransformer from "./ProjectTransformer";
import HostsTransformer from "./ProjectTransformer";

export default class UserTransformer extends Transformer {
    transform(model) {
        return {
            id: model.id,
            email: model.email,
            first_name: model.first_name,
            last_name: model.last_name,
            status: model.status,
            created_at: model.created_at,
            updated_at: model.updated_at
        };
    }
    includeProjects(model) {
        return this.collection(model.projects, new ProjectTransformer());
    }

}