import Transformer from './Transformer';

export default class PermissionRoleTranformer extends Transformer {
  transform(model) {
    return {
      role_id: model.role_id,
      permission_id: model.permission_id
    };
  }
}
