import { AbstractValidator } from './Validator';

export const CREATE_PROJECT_RULE = 'create_project';
export const UPDATE_PROJECT_RULE = 'update_project';

export class ProjectValidator extends AbstractValidator {
  static getRules() {
    return {
      [CREATE_PROJECT_RULE]: {},
      [UPDATE_PROJECT_RULE]: {}
    };
  }
}
