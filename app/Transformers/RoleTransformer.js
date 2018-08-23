import Transformer from './Transformer';
import PermissionTransformer from './PermissionTransformer';

export default class RoleTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      description: model.description,
      level: model.level,
      created_at: model.created_at,
      updated_at: model.updated_at
    };
  }

  defaultIncludes() {
    return ['permissions'];
  }

  includePermissions(model) {
    return this.collection(model.permissions, new PermissionTransformer());
  }
}
