import { AbstractValidator } from './Validator';
export const CREATE_FRAMEWORK_RULE = 'create_framework';
export const UPDATE_FRAMEWORK_RULE = 'update_framework';
export class FrameworkValidator extends AbstractValidator {
  static getRules() {
    return {
      [CREATE_FRAMEWORK_RULE]: {},
      [UPDATE_FRAMEWORK_RULE]: {}
    };
  }
}
