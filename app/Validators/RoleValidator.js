import { AbstractValidator, REQUIRED } from './Validator';
import _ from 'lodash';
import { Exception } from '../Exceptions/Exception';

export const RULE_CREATE_ROLE = 'create_role';

export class RoleValidator extends AbstractValidator {
  static getRules() {
    return {
      setPermissionsToRole: {
        permissions: [
          REQUIRED,
          value => {
            if (!_.isArray(value)) {
              throw new Exception('permissions should be an array', 1000);
            }
            return true;
          }
        ]
      },
      [RULE_CREATE_ROLE]: {
        name: [REQUIRED, 'min:3', 'max:40']
      }
    };
  }
}
