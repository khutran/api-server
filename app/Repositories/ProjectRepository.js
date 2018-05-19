import models from '../../models';
import { Repository } from './Repository';

export default class ProjectRepository extends Repository {
  Models() {
    return models.project;
  }
}
