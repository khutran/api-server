import ServiceProvider from './ServiceProvider';
import { App } from '../Services/App';
import Authenticate from '../Services/Authenticate';
import Request from '../Services/Request';

export default class AppServiceProvider extends ServiceProvider {
  register() {
    App.singleton('Auth', Authenticate);
    App.singleton('Request', Request);
  }
}
