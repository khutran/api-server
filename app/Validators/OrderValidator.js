import { AbstractValidator, REQUIRED, IS_INT } from './Validator';
import { Exception } from '../Exceptions/Exception';
import _ from 'lodash';

export const CREATE_ORDER_RULE = 'create_order';
export class OrderValidator extends AbstractValidator {
  static getRules() {
    return {
      [CREATE_ORDER_RULE]: {
        user_id: [REQUIRED, IS_INT],
        shipping_address_id: [REQUIRED, IS_INT],
        billing_address_id: [REQUIRED, IS_INT],
        delivery_method: [REQUIRED],
        shipping_courrier: [REQUIRED],
        payment_method: [REQUIRED],
        items: [
          REQUIRED,
          items => {
            if (!_.isArray(items)) {
              throw new Exception('items should be an array', 1000);
            }
            return true;
          }
        ]
      }
    };
  }
}
