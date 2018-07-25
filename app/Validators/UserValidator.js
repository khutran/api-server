import { AbstractValidator, REQUIRED, IS_EMAIL, IS_INT } from './Validator';

export const CREATE_USER_RULE = 'create_user';
export class UserValidator extends AbstractValidator {
  static getRules() {
    return {
      [CREATE_USER_RULE]: {
        email: [REQUIRED, IS_EMAIL],
        password: [REQUIRED, 'min:6', 'max:20'],
        first_name: [REQUIRED, 'max:40'],
        last_name: [REQUIRED, 'max:40'],
        role_id: [REQUIRED, IS_INT]
      }
    };
  }
}
