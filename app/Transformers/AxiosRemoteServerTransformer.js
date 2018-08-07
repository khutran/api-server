import Transformer from './Transformer';

export default class AxiosRemoteServerTransformer extends Transformer {
  transform(model) {
    return model.data.data;
  }
}
