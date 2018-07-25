import { AbstractValidator } from './Validator';

export const CREATE_STATUS_RULE = 'create_status';
export const UPDATE_STATUS_RULE = 'update_status';

export class StatusValidator extends AbstractValidator {
  static getRules() {
    return {
      [CREATE_STATUS_RULE]: {},
      [UPDATE_STATUS_RULE]: {}
    };
  }
}
