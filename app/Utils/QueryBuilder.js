import * as _ from 'lodash';
import { Exception } from '../Exceptions/Exception';
import models from '../../models';
import { Op } from 'sequelize';

export class QueryBuilder {
  constructor() {
    this.wheres = [];
    this.scopeQueries = [];
    this.scopes = [];
    this.offset = 0;
    this.limit = 10;
    this.orders = [];
    this.group = undefined;
    this.includes = [];
    this.attributes = [];
  }

  /**
   * Add a basic WHERE clause to the query.
   *
   * @param  string  column
   * @param  mixed   operator
   * @param  mixed   value
   *
   * @return this
   */
  where(...args) {
    const type = Op.and;
    let column;
    let operation = '=';
    let value;
    if (args.length === 2) {
      [column, value] = [args[0], args[1]];
    } else if (args.length === 3) {
      [column, operation, value] = args;
    } else if (args.length === 1) {
      // means raw query
      [column, operation, value] = [args[0], null, null];
    } else {
      throw new Exception('where function expect two or three parameters', 1000);
    }
    this.wheres.push({ column, operation, value, type });
    return this;
  }

  /**
   * Add a basic WHERE clause to the query.
   *
   * @param  string  column
   * @param  mixed   operator
   * @param  mixed   value
   *
   * @return this
   */
  scopeQuery(query, type = Op.and) {
    this.scopeQueries.push({ query, type });
    return this;
  }

  /**
   * Add a basic OR WHERE clause to the query.
   *
   * @param  string  column
   * @param  mixed   operator
   * @param  mixed   value
   *
   * @return this
   */
  orWhere(...args) {
    const type = Op.or;
    let column;
    let operation = '=';
    let value;
    if (args.length === 2) {
      [column, value] = [args[0], args[1]];
    } else if (args.length === 3) {
      [column, operation, value] = args;
    } else if (args.length === 1) {
      // means raw query
      [column, operation, value] = [args[0], null, null];
    } else {
      throw new Exception('orWhere function expect two or three parameters', 1000);
    }
    this.wheres.push({ column, operation, value, type });
    return this;
  }

  /**
   * Add an "WHERE IN" clause to the query.
   *
   * @param  string  column
   * @param  array   value
   *
   * @return this
   */
  whereIn(column, value) {
    const operation = Op.in;
    const type = Op.and;
    this.wheres.push({ column, operation, value, type });
    return this;
  }

  /**
   * Add an "WHERE NOT IN" clause to the query.
   *
   * @param  string  column
   * @param  array   value
   *
   * @return this
   */
  whereNotIn(column, value) {
    const operation = Op.notIn;
    const type = Op.and;
    this.wheres.push({ column, operation, value, type });
    return this;
  }

  /**
   * Add a basic where clause with relation to the query.
   *
   * @param  string  relation
   * @param  callable callable
   *
   * @return this
   */
  whereHas(relation, builder) {
    if (typeof relation === 'string') {
      relation = models[relation];
    }
    this.includes.push({ model: relation, where: builder.buildWhereQuery() });
    return this;
  }

  /**
   * include another table that has many to many relationship with it
   *
   * @param  string  relation
   * @param  callable builder
   *
   * @return this
   */
  includeThroughWhere(relation, builder) {
    this.includes.push({ model: models[relation], through: { where: builder.buildWhereQuery() } });
    return this;
  }

  /**
   * Alias to set the "offset" value of the query.
   *
   * @param  int  value
   *
   * @return this
   */
  skip(offset) {
    this.offset = _.isUndefined(offset) ? 1 : parseInt(offset);
  }

  /**
   * Alias to set the "limit" value of the query.
   *
   * @param  int  value
   *
   * @return this
   */
  take(limit) {
    this.limit = _.isUndefined(limit) ? undefined : parseInt(limit);
  }

  /**
   * Add an "order by" clause to the query.
   *
   * @param  string  column
   * @param  string  direction
   *
   * @return this
   */
  orderBy(...args) {
    let model;
    let field;
    let direction = 'ASC';
    if (args.length === 2) {
      [field, direction] = args;
      this.orders.push([field, direction]);
    }
    if (args.length === 3) {
      [model, field, direction] = args;
      this.orders.push([model, field, direction]);
    }
    if (args.length === 1) {
      [field] = args;
      this.orders.push(field);
    }
  }

  /**
   * Add an "GROUP BY" clause to the query.
   *
   * @param  string  column
   *
   * @return this
   */
  groupBy(column) {
    this.group = column;
  }

  rawWith(include) {
    if (!_.isEmpty(this.includes)) {
      this.includes.push(include);
    } else {
      this.includes = [];
      this.includes.push(include);
    }
  }

  /**
   * Begin querying a model with eager loading.
   *
   * @param  array|string  $relations
   *
   * @return this
   */
  with(...args) {
    if (_.isArray(args[0])) {
      args = args[0];
    }
    let mainModel = args[0];
    if (typeof args[0] === 'string') {
      mainModel = models[args[0]];
    }
    let include = { model: mainModel };
    const arr = [];
    let arrayInclude = [];
    const obj = {};

    for (let i = 1; i < args.length; i++) {
      if (args[i]) {
        arr.push(args[i].split(':'));
      }
    }

    _.forEach(arr, item => {
      switch (item[0]) {
        case 'as':
          obj[item[0]] = item[1];
          Object.assign(include, obj);
          break;
        case 'attributes':
          obj[item[0]] = [];
          for (let j = 1; j < item.length; j++) {
            obj[item[0]].push(item[j]);
          }
          Object.assign(include, obj);
          break;
        case 'include':
          let model = item[1];
          if (typeof item[1] === 'string') {
            model = models[item[1]];
          }
          const includeObj = { model: model };
          if (item[2] === 'as') {
            Object.assign(includeObj, { as: item[3] });
          }
          arrayInclude.push(includeObj);
          break;
        default:
          break;
      }
    });

    arrayInclude = _.reverse(arrayInclude);
    for (let i = 0; i < arrayInclude.length - 1; i++) {
      Object.assign(arrayInclude[i + 1], { include: arrayInclude[i] });
    }

    if (!_.isNil(arrayInclude[arrayInclude.length - 1])) {
      Object.assign(include, { include: arrayInclude[arrayInclude.length - 1] });
    }

    _.forEach(this.includes, value => {
      if (value['model'] === include['model'] && include['include']) {
        Object.assign(value, include);
        include = {};
      }
    });

    if (!_.isEmpty(include)) {
      this.includes.push(include);
    }
  }

  /**
   * Add scope to the query
   *
   * @param  string scope
   *
   * @return this
   */
  withScope(scope) {
    this.scopes.push(scope);
  }

  /**
   * Set the columns to be selected.
   *
   * @param  array|mixed  $columns
   *
   * @return this
   */
  select(columns) {
    this.attributes = columns;
    return this;
  }

  resolveOperation(operation) {
    switch (operation) {
      case '=':
        return Op.eq;
      case '>':
        return Op.gt;
      case '<':
        return Op.lt;
      case '>=':
        return Op.gte;
      case '<=':
        return Op.lte;
      case 'contains':
        return Op.contains;
      case 'between':
        return Op.between;
      case '<>':
      case '!=':
        return Op.ne;
      case 'like':
      case 'LIKE':
        return Op.like;
      default:
        return operation;
    }
  }

  buildWhereQuery() {
    let query = {};

    const group = _.groupBy(this.wheres, 'type');
    if (this.wheres.length === 0 && this.scopeQueries.length === 0) {
      return query;
    }

    if (!_.isUndefined(group[Op.or]) && group[Op.or].length > 0) {
      query = {
        [Op.or]: []
      };
      if (!_.isUndefined(group[Op.and]) && group[Op.and].length > 0) {
        const andQuery = {};
        _.forEach(group[Op.and], item => {
          if (item.operation === null && item.value == null) {
            query[Op.or].push(item.column);
          } else {
            andQuery[item.column] = { [this.resolveOperation(item.operation)]: item.value };
          }
        });
        query[Op.or].push({ [Op.and]: andQuery });
      }
      _.forEach(group[Op.or], item => {
        // means raw query
        if (item.operation === null && item.value == null) {
          query[Op.or].push(item.column);
        } else {
          query[Op.or].push({ [item.column]: { [this.resolveOperation(item.operation)]: item.value } });
        }
      });
    } else {
      query = {
        [Op.and]: []
      };
      _.forEach(group[Op.and], item => {
        if (item.operation === null && item.value == null) {
          query[Op.and].push(item.column);
        } else {
          query[Op.and].push({ [item.column]: { [this.resolveOperation(item.operation)]: item.value } });
        }
      });
    }
    if (_.isArray(this.scopeQueries) && this.scopeQueries.length > 0) {
      _.forEach(this.scopeQueries, item => {
        if (query[item.type] !== undefined && _.isArray(query[item.type])) {
          query[item.type].push({ [item.type]: item.query.buildWhereQuery() });
        } else {
          query[item.type] = item.query.buildWhereQuery();
        }
      });
    }
    return query;
  }
}
