import { AbstractValidator, REQUIRED, IS_INT } from './Validator';

export const RULE_CREATE_PRODUCT = 'create_product';
export const RULE_UPDATE_PRODUCT_STATUS = 'update_product_status';

export class ProductValidator extends AbstractValidator {
  static getRules() {
    return {
      [RULE_CREATE_PRODUCT]: {},
      [RULE_UPDATE_PRODUCT_STATUS]: {
        status: [REQUIRED, IS_INT]
      }
    };
  }
}
