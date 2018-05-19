import Transformer from './Transformer';
import HostSshKeyTransformer from './HostSshKeyTransformer';

export default class HostTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      ip: model.ip,
      created_at: model.created_at,
      updated_at: model.updated_at
    };
  }

  includeHostSshkeys(model) {
    return this.collection(model.host_sshkeys, new HostSshKeyTransformer());
  }
}
