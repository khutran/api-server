import { App } from '../App';
import _ from 'lodash';
export class Request {
  static createFromRequest(request) {
    return App.make('Request').createFromRequest(request);
  }

  /**
   * Returns the parameters.
   *
   * @return array An object of parameters
   */
  static all() {
    return App.make('Request').all();
  }

  /**
   * Gets a "parameter" value from any bag.
   *
   * This method is mainly useful for libraries that want to provide some flexibility. If you don't need the
   * flexibility in controllers, it is better to explicitly get request parameters from the appropriate
   * public property instead (attributes, query, request).
   *
   * Order of precedence: PATH (routing placeholders or custom attributes), GET, BODY
   *
   * @param string key     The key
   * @param mixed  default The default value if the parameter key does not exist
   *
   * @return mixed
   */
  static get(param, defaultValue = null) {
    if (this.has(param)) {
      return App.make('Request').all()[param];
    } else {
      return defaultValue;
    }
  }

  /**
   * Returns true if the parameter is defined.
   *
   * @param string key The key
   *
   * @return bool true if the parameter exists, false otherwise
   */
  static has(param) {
    return !_.isUndefined(_.find(_.keys(App.make('Request').all()), item => item === param));
  }
  /**
   * Clear the request
   *
   * @return void
   */
  static clear() {
    App.make('Request').clear();
  }
}
