import { AbstractValidator } from './Validator';

export const CREATE_PERMISSION_RULE = 'create_permission';
export const UPDATE_PERMISSION_RULE = 'update_permission';

export class ServerValidator extends AbstractValidator {
  static getRules() {
    return {
      [CREATE_PERMISSION_RULE]: {},
      [UPDATE_PERMISSION_RULE]: {}
    };
  }
}
