import Transformer from './Transformer';
import PermissionTransformer from './PermissionTransformer';

export default class PermissionGroupTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      slug: model.slug,
      name: model.name
    };
  }

  includePermissions(model) {
    return this.collection(model.permissions, new PermissionTransformer());
  }
}
