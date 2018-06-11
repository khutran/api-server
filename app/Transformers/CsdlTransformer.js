import Transformer from './Transformer';

export default class CsdlTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name
    };
  }
}
