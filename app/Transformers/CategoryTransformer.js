import Transformer from './Transformer';

export default class CategoryTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name
    };
  }
}
