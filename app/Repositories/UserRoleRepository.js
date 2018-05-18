import models from '../../models';
import { Repository } from './Repository';

export default class UserRoleRepository extends Repository {
  Models() {
    return models.user_role;
  }
}
