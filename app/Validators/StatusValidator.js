import { AbstractValidator } from './Validator';
export class StatusValidator extends AbstractValidator {
  static getRules() {
    return {
      create: {}
    };
  }
}
