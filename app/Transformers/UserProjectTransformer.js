import Transformer from './Transformer';

export default class UserProjectTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      user_id: model.user_id,
      project_id: model.project_id,
      created_at: model.created_at,
      updated_at: model.updated_at
    };
  }
}
