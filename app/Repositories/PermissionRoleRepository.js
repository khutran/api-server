import models from '../../models';
import { Repository } from './Repository';
export default class PermissionRoleRepository extends Repository {
  Model() {
    return models.permission_role;
  }
}
