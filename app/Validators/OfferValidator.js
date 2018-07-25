import { AbstractValidator, REQUIRED, IS_INT, IS_FLOAT } from './Validator';

export const CREATE_OFFER_RULE = 'create_offer';
export const UPDATE_OFFER_RULE = 'update_offer';

export class OfferValidator extends AbstractValidator {
  static getRules() {
    return {
      [CREATE_OFFER_RULE]: {
        user_id: [REQUIRED, IS_INT],
        product_id: [REQUIRED, IS_INT],
        initial_amount: [IS_FLOAT]
      },
      [UPDATE_OFFER_RULE]: {}
    };
  }
}
