import models from '../../models';
import { Repository } from './Repository';

export default class ForgotPasswordRepository extends Repository {
  Models() {
    return models.forgot_password;
  }
}
