import models from '../../models';
import { Repository } from './Repository';

export default class PermissionGroupRepository extends Repository {
  Models() {
    return models.PermissionGroup;
  }
}
