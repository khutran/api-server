import { AbstractValidator, REQUIRED, IS_EMAIL } from './Validator';

export const REFLAUNT_CREATE_ITEM = 'create_item';

export class ReflauntValidator extends AbstractValidator {
  static getRules() {
    return {
      [REFLAUNT_CREATE_ITEM]: {
        product_id: [REQUIRED],
        name: [REQUIRED],
        image: [REQUIRED],
        description: [REQUIRED],
        customer_email: [REQUIRED, IS_EMAIL],
        phone_number: [REQUIRED],
        original_price: [REQUIRED],
        selling_price: [],
        color: [],
        size: []
      }
    };
  }
}
