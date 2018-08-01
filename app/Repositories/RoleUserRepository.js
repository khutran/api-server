import models from '../../models';
import { Repository } from './Repository';

export default class RoleUserRepository extends Repository {
  Models() {
    return models.role_user;
  }

  async creatRole_user(user_id, role_id) {
    this.user_id = user_id;
    this.role_id = role_id;
    const resultsCreate = await models.role_user.create({
      user_id: this.user_id,
      role_id: this.role_id
    });

    return resultsCreate;
  }
}
