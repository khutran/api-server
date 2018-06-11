import models from '../../models';
import { Repository } from './Repository';

export default class FrameworkRepository extends Repository {
  Models() {
    return models.framework;
  }
}
