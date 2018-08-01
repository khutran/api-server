import { AbstractValidator } from './Validator';
export const CREATE_CATEGORY_RULE = 'create_category';
export const UPDATE_CATEGORY_RULE = 'update_category';
export class CategoryValidator extends AbstractValidator {
  static getRules() {
    return {
      [CREATE_CATEGORY_RULE]: {},
      [UPDATE_CATEGORY_RULE]: {}
    };
  }
}
