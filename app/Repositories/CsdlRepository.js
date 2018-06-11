import models from '../../models';
import { Repository } from './Repository';

export default class CsdlRepository extends Repository {
  Models() {
    return models.csdl;
  }
}
