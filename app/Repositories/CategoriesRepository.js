import models from '../../models';
import { Repository } from './Repository';

export default class CategoriesRepository extends Repository {
  Models() {
    return models.categories;
  }
}
