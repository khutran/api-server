import Transformer from "./Transformer";

export default class StatusTransformer extends Transformer {
    transform(model) {
        return {
            id: model.id,
            name: model.name,
            created_at: model.created_at,
            updated_at: model.updated_at
        };
    }
}