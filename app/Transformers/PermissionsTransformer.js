import Transformer from './Transformer';

export default class PermissionsTranformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug
    };
  }
}
