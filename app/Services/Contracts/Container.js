import crypto from 'crypto';
import { Exception } from '../../Exceptions/Exception';

export default class Container {
  constructor() {
    this.bindings = [];
    this.parameters = [];
  }
  /**
   * Register a binding with the container.
   *
   * @param string|class abstract
   * @param class concrete
   * @param  bool isSingleton
   *
   * @return void
   */
  bind(abstract, concrete, isSingleton = false) {
    const resolved_abstract = this.resolveAbstract(abstract);
    let f = this.bindings.find((item, key) => key === resolved_abstract);
    if (f !== undefined) {
      throw new Exception('can not bind instance', 1001);
    }
    this.bindings[resolved_abstract] = { abstract, concrete, isSingleton };
  }
  /**
   * Resolve the given type from the container.
   *
   * @param string|class abstract
   * @param parameters
   * @return mixed
   */
  make(abstract, parameters = []) {
    let resolved_abstract = this.resolveAbstract(abstract);
    this.parameters = parameters;
    if (this.bindings === undefined) {
      this.bindings = [];
    }
    if (this.bindings[resolved_abstract] === undefined) {
      if (typeof abstract === 'string') {
        return 'null';
      } else {
        return new abstract();
      }
    } else {
      if (this.bindings[resolved_abstract]['isSingleton'] === true) {
        if (this.bindings[resolved_abstract]['instance'] === undefined) {
          this.bindings[resolved_abstract]['instance'] = new this.bindings[resolved_abstract]['concrete']();
        }
        return this.bindings[resolved_abstract]['instance'];
      } else {
        return new this.bindings[resolved_abstract]['concrete']();
      }
    }
  }

  resolveAbstract(abstract) {
    const md5sum = crypto.createHash('md5');
    return md5sum.update(abstract.toString()).digest('hex');
  }

  static getInstance() {
    if (this.instance === undefined) {
      this.instance = new this();
    }
    return this.instance;
  }

  /**
   * Check the abstract is bound.
   *
   * @param string|class abstract
   * @return bool
   */
  check(abstract) {
    let resolved_abstract = this.resolveAbstract(abstract);
    if (this.bindings[resolved_abstract] === undefined) {
      return false;
    } else {
      return true;
    }
  }
}
