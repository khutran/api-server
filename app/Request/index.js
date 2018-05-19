import * as _ from 'lodash';
import { library } from './library';

export class Request extends library {
  constructor(collection, value) {
    super(collection);
    this.validateOfcollection();
  }

  check(check) {
    Object.keys(this.validate(this.collection));
  }

  customs(query) {
    for (let key in this.validate[this.collection]) {
      query[key] = this.validate[this.collection][key](query[key]);
    }

    return query;
  }
}
