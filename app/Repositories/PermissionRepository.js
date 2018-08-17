import models from '../../models';
import { Repository } from './Repository';

export default class PermissionRepository extends Repository {
  Models() {
    return models.permission;
  }
}
