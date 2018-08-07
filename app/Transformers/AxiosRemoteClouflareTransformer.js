import Transformer from './Transformer';

export default class AxiosRemoteCloudflareTransformer extends Transformer {
  transform(model) {
    return model.data.result;
  }
}
