import { library } from './library';

export class Request extends library {
  constructor(collection) {
    super(collection);
    this.validateOfcollection();
  }

  customs(query) {
    for (let key in this.validate[this.collection]) {
      query[key] = this.validate[this.collection][key](query[key]);
    }

    return query;
  }
}
