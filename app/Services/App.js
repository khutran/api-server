import Container from './Contracts/Container';
import AppProviders from '../Configs/Providers';

export class App {
  /**
   * Register a binding with the container.
   *
   * @param string|class abstract
   * @param class concrete
   * @param bool isSingleton
   *
   * @return void
   */
  static bind(abstract, concrete, isSingleton = false) {
    const container = Container.getInstance();
    container.bind(abstract, concrete, isSingleton);
  }

  /**
   * Register a singleton with the container.
   *
   * @param string|class abstract
   * @param class concrete
   *
   * @return void
   */
  static singleton(abstract, concrete) {
    const container = Container.getInstance();
    container.bind(abstract, concrete, true);
  }

  /**
   * Resolve the given type from the container.
   *
   * @param string|class abstract
   * @param parameters
   * @return mixed
   */
  static make(abstract, parameters = []) {
    const container = Container.getInstance();
    return container.make(abstract, parameters);
  }

  static resolveAppProviders() {
    AppProviders.map(provider => {
      new provider().register();
    });
  }

  /**
   * Check the abstract is bound.
   *
   * @param string|class abstract
   * @return bool
   */
  static check(abstract) {
    const container = Container.getInstance();
    return container.check(abstract);
  }
}
