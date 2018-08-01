import { AbstractValidator, REQUIRED, IS_INT, IS_BOOLEAN } from './Validator';
import { Exception } from '../Exceptions/Exception';
import _ from 'lodash';

export const SET_DEFAULT_ADDRESS_RULE = 'setDefaultAddress';
export const SET_DEFAULT_ADDRESS_TYPE = 'address';
export const SET_DEFAULT_BILLING_ADDRESS_TYPE = 'billing';

export class AddressValidator extends AbstractValidator {
  static getRules() {
    return {
      [SET_DEFAULT_ADDRESS_RULE]: {
        user_id: [REQUIRED, IS_INT],
        address_id: [REQUIRED, IS_INT],
        is_default: [REQUIRED, IS_BOOLEAN],
        type: [
          REQUIRED,
          type => {
            if (!_.includes([SET_DEFAULT_ADDRESS_TYPE, SET_DEFAULT_BILLING_ADDRESS_TYPE], type)) {
              throw new Exception('type should be "address" for set default address or "billing" for set default billing address', 1000);
            }
            return true;
          }
        ]
      }
    };
  }
}
