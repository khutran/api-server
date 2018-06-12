import Transformer from './Transformer';

export default class FrameworkTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      csdl: model.csdl,
      package_manager: model.package_manager,
      content_config: model.content_config
    };
  }
}
