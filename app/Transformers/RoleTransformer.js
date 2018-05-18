import Transformer from './Transformer';

export default class StatusTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      permissions: model.permissions,
      description: model.description,
      level: model.level,
      created_at: model.created_at,
      updated_at: model.updated_at
    };
  }
}
