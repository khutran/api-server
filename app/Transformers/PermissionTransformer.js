import Transformer from './Transformer';

export default class PermissionTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      level: model.level,
      description: model.description
    };
  }
}
