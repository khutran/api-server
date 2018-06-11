import Transformer from './Transformer';
import StatusTransformer from './StatusTransformer';
import BuildTransformer from './BuildTransformer';
import FrameworkTransformer from './FrameworkTransformer';
import CsdlTransformer from './CsdlTransformer';
import CategoriesTransformer from './CategoriesTransformer';

export default class ProjectTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      categories: model.categories,
      framework: model.framework,
      csdl: model.csdl,
      status: model.status,
      build: model.build,
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

  includeCsdl(model) {
    return this.item(model.csdl, new CsdlTransformer());
  }

  includeCategories(model) {
    return this.item(model.category, new CategoriesTransformer());
  }

  includeFramework(model) {
    return this.item(model.framework, new FrameworkTransformer());
  }
}
