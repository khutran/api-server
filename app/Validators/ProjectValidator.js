import { AbstractValidator, REQUIRED, IS_INT } from './Validator';

export const CREATE_PROJECT_RULE = 'create_project';
export const UPDATE_PROJECT_RULE = 'update_project';

export class ProjectValidator extends AbstractValidator {
  static getRules() {
    return {
      [CREATE_PROJECT_RULE]: {
        name: [REQUIRED],
        status_id: [REQUIRED, IS_INT],
        category_id: [REQUIRED, IS_INT],
        framework_id: [REQUIRED, IS_INT],
        csdl_id: [REQUIRED, IS_INT],
        server_id: [REQUIRED, IS_INT],
        database: [REQUIRED],
        git_remote: [REQUIRED],
        git_branch: [REQUIRED],
        git_application_key: [REQUIRED],
        git_application_secret: [REQUIRED]
      },
      [UPDATE_PROJECT_RULE]: {}
    };
  }
}
