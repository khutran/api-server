import { AbstractValidator } from './Validator';

export const CREATE_SERVER_RULE = 'create_server';
export const UPDATE_SERVER_RULE = 'update_server';

export class ServerValidator extends AbstractValidator {
  static getRules() {
    return {
      [CREATE_SERVER_RULE]: {},
      [UPDATE_SERVER_RULE]: {}
    };
  }
}
