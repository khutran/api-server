import models from '../../models';
import { Repository } from './Repository';

export default class CategoryRepository extends Repository {
  Models() {
    return models.category;
  }
}
