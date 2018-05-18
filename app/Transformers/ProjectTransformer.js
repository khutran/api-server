import Transformer from './Transformer';
import StatusTransformer from './StatusTransformer';
import BuildTransformer from './BuildTransformer';

export default class ServerTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      categories: model.categories,
      status: model.status,
      build: model.build,
      framework: model.framework,
      created_at: model.created_at,
      updated_at: model.updated_at
    };
  }

  includeStatus(model) {
    return this.item(model.status, new StatusTransformer());
  }

  includeBuild(model) {
    return this.item(model.build, new BuildTransformer());
  }
}
