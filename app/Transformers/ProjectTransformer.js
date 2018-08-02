import Transformer from './Transformer';
import StatusTransformer from './StatusTransformer';
import FrameworkTransformer from './FrameworkTransformer';
import CsdlTransformer from './CsdlTransformer';
import CategoryTransformer from './CategoryTransformer';
import HostTransformer from './HostTransformer';
import UserTransformer from './UserTransformer';

export default class ProjectTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      status_id: model.status_id,
      category_id: model.category_id,
      framework_id: model.framework_id,
      csdl_id: model.csdl_id,
      host_id: model.host_id,
      database: model.database,
      git_remote: model.git_remote,
      git_branch: model.git_branch,
      git_application_key: model.git_application_key,
      git_application_secret: model.git_application_secret,
      build_automatically: model.build_automatically,
      backup: model.backup,
      build_time: model.build_time,
      created_at: model.created_at,
      updated_at: model.updated_at
    };
  }

  includeStatus(model) {
    return this.item(model.status, new StatusTransformer());
  }

  includeHost(model) {
    return this.item(model.host, new HostTransformer());
  }

  includeCsdl(model) {
    return this.item(model.csdl, new CsdlTransformer());
  }

  includeCategories(model) {
    return this.item(model.category, new CategoryTransformer());
  }

  includeFramework(model) {
    return this.item(model.framework, new FrameworkTransformer());
  }

  includeUsers(model) {
    return this.collection(model.users, new UserTransformer());
  }
}
