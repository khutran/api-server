import { AbstractValidator, REQUIRED, IS_EMAIL } from './Validator';
export const REGISTER_RULE = 'register';

export class AuthValidator extends AbstractValidator {
  static getRules() {
    return {
      [REGISTER_RULE]: {
        email: [REQUIRED, IS_EMAIL],
        password: [REQUIRED, 'min:6', 'max:20'],
        first_name: [REQUIRED, 'max:40'],
        last_name: [REQUIRED, 'max:40']
      }
    };
  }
}
