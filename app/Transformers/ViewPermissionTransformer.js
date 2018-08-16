import Transformer from './Transformer';

export default class ViewPermissionTransformer extends Transformer {
  transform(model) {
    return {
      view: model.view,
      get: model.get,
      update: model.update,
      create: model.create,
      delete: model.delete
    };
  }
}
