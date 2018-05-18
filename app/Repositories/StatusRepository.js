import models from '../../models';
import { Repository } from './Repository';

export default class StatusRepository extends Repository {
  Models() {
    return models.status;
  }
}
