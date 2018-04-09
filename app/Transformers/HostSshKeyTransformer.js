import Transformer from "./Transformer";

export default class HostSshKeyTransformer extends Transformer {
    transform(model) {
        return {
            id: model.id,
            host_id: model.host_id,
            ssh_key: model.ssh_key,
            created_at: model.created_at,
            updated_at: model.updated_at
        };
    }
}