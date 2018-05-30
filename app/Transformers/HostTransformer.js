import Transformer from './Transformer';

export default class HostTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      ip: model.ip,
      address_mysql: model.address_mysql,
      created_at: model.created_at,
      updated_at: model.updated_at
    };
  }
}
