import models from '../../models';
import { Repository } from './Repository';

export default class UserProjectRepository extends Repository {
  Models() {
    return models.user_project;
  }
}
