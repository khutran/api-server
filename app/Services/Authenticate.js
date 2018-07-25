import { NotFoundException } from '../Exceptions/NotFoundException';
import _ from 'lodash';
import models from '../../models';

export default class Authenticate {
  async loginByEmail(email) {
    const user = await models.user.findOne({ where: { email: email }, include: [{ model: models.role }] });
    if (_.isNil(user)) {
      throw new NotFoundException('user');
    }
    this.setAuthenticated(user);
    return this.getUser();
  }

  /**
   * Set status authenticated
   *
   * @param object
   *
   * @return void
   */
  setAuthenticated(user) {
    this.isAuthenticated = true;
    if (_.isUndefined(process.domain._req.locals)) {
      process.domain._req.locals = {};
    }
    process.domain._req.locals.user = user;
  }

  /**
   * Get current logged in user
   *
   * @return object
   */
  getUser() {
    if (_.isUndefined(process.domain._req.locals) || _.isUndefined(process.domain._req.locals.user)) {
      return null;
    }
    return process.domain._req.locals.user;
  }
}
