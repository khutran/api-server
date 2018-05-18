import models from '../../models';
import { Repository } from './Repository';

export default class UserRepository extends Repository {
  Models() {
    return models.user;
  }
}
