import Transformer from './Transformer';

export default class AxiosTransformer extends Transformer {
  transform(model) {
    return model.data.data;
  }
}
