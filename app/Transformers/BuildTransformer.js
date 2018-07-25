import Transformer from './Transformer';
import HostTransformer from './HostTransformer';

export default class BuildTransformer extends Transformer {
  transform(model) {
    return {
      git: model.git,
      git_branch: model.git_branch,
      git_key: model.git_key,
      git_secret: model.git_secret,
      build_auto: model.build_auto,
      backup: model.backup,
      last_build: model.last_build
    };
  }

  includeHost(model) {
    return this.item(model.host, new HostTransformer());
  }
}
