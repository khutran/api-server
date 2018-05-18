import * as _ from 'lodash';
import Error from '../Exceptions/CustomsError';

const query = {
  sort: value => {
    let _sort = {};
    let arrSort = _.split(value, ',');

    _.forEach(arrSort, item => {
      if (_.isNil(item) || item === '' || !_.isString(item)) {
        _sort['id'] = 'DESC';
      } else {
        if (item.indexOf('-') === 0) {
          let _value = item.slice(1);
          _sort[_value] = 'DESC';
        } else {
          _sort[item] = 'ASC';
        }
      }
    });

    return _sort;
  },

  search: value => {
    if (_.isNil(value) || value === '' || !_.isString(value)) {
      return undefined;
    } else {
      return `%${value}%`;
    }
  },

  constraints: value => {
    try {
      if (_.isUndefined(value)) {
        return undefined;
      } else {
        value = JSON.parse(value);
        if (_.isEmpty(value) || !_.isObject(value)) {
          throw new Error('syntax constraints undefined', 1000);
        } else {
          for (let i in value) {
            if (!_.isString(i) || _.isObject(value[i])) {
              throw new Error('syntax constraints undefined', 1000);
            }
          }
          return value;
        }
      }
    } catch (e) {
      throw new Error('syntax constraints undefined', 1000);
    }
  }
};

module.exports = {
  query: query
};
