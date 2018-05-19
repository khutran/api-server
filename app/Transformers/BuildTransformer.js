import Transformer from './Transformer';

export default class HostTransformer extends Transformer {
  transform(model) {
    return {
      host: model.host,
      git: model.git,
      git_branch: model.git_branch,
      git_key: model.git_key,
      git_secret: model.git_secret,
      build_auto: model.build_auto,
      backup: model.backup,
      last_build: model.last_build
    };
  }
}
