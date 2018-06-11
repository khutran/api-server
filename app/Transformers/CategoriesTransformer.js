import Transformer from './Transformer';

export default class CategoriesTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name
    };
  }
}
