import Transformer from "./Transformer";
import HostTransformer from "./HostTransformer";
import StatusTransformer from "./StatusTransformer";

export default class ServerTransformer extends Transformer {
    transform(model) {
         return {
            id: model.id,
            name: model.name,
            host: model.host,
            categories: model.categories,
            git: model.git,
            status: model.status,
            framework: model.framework,
            created_at: model.created_at,
            updated_at: model.updated_at
        };
    }

    includeHost(model) {
        return this.item(model.host, new HostTransformer());
    }

    includeStatus(model) {
        return this.item(model.status, new StatusTransformer());
    }
}