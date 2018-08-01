import { App } from '../App';

export class Auth {
  /**
   * Log a user into the application by email.
   *
   * @param string email
   * @return object
   */
  static async loginByEmail(email) {
    let auth = App.make('Auth');
    return auth.loginByEmail(email);
  }

  /**
   * Determine the use is logged in
   *
   * @return bool
   */
  static check() {
    return App.make('Auth').isAuthenticated;
  }

  /**
   * Get the currently authenticated user.
   *
   * @return object
   */
  static user() {
    return App.make('Auth').getUser();
  }

  /**
   * Get the currently authenticated id.
   *
   * @return integer
   */
  static id() {
    return App.make('Auth').getUser().id;
  }
}
