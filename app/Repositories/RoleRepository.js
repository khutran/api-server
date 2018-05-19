import models from '../../models';
import { Repository } from './Repository';

export default class RoleRepository extends Repository {
  Models() {
    return models.role;
  }
}
