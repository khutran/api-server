import * as _ from 'lodash';
import { Exception } from '../Exceptions/Exception';
import { LengthAwarePaginator } from '../Utils/LengthAwarePaginator';

export default class ApiResponse {
  static item(obj, transformer) {
    return { data: transformer.get(obj) };
  }

  static collection(collection, transformer) {
    let data = _.map(collection, i => {
      return transformer.get(i);
    });
    return { data: data };
  }

  static array(array) {
    if (!_.isArray(array)) {
      throw new Exception('ApiResponse.array expect an array', 2001);
    }
    return { data: array };
  }

  static paginate(paginator, transformer) {
    if (!(paginator instanceof LengthAwarePaginator)) {
      throw new Exception(`ApiResponse.paginate expect a LengthAwarePaginator instead a ${typeof paginator}`, 2001);
    }
    let items = _.map(paginator.getItems(), i => {
      return transformer.get(i);
    });
    paginator.setItems(items);
    return {
      data: paginator.getItems(),
      meta: {
        pagination: {
          total: paginator.getTotal(),
          per_page: paginator.getPerPage(),
          current_page: paginator.getCurrentPage(),
          last_page: paginator.getLastPage(),
          total_pages: paginator.getTotalPages()
        }
      }
    };
  }

  static success() {
    return { data: { success: true } };
  }
}
