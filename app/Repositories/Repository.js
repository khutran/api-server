import * as _ from 'lodash';
import { Exception } from '../Exceptions/Exception';
import { LengthAwarePaginator } from '../Utils/LengthAwarePaginator';
import { QueryBuilder } from '../Utils/QueryBuilder';
import { Request } from '../Services/Facades/Request';
import { NotFoundException } from '../Exceptions/NotFoundException';
import moment from 'moment/moment';
export class Repository {
  constructor() {
    this.builder = new QueryBuilder();
  }

  /**
   * Create or update a record matching the attributes, and fill it with values
   *
   * @param Object attributes
   * @param Object values
   *
   * @return Object
   */
  async updateOrCreate(attributes, values) {
    if (_.isNil(attributes)) {
      throw new Exception('attributes should not empty', 1000);
    }

    const item = await this.Models().findOne({
      where: attributes
    });

    let result;

    if (item) {
      result = await item.update(values);
    } else {
      result = await this.Models().create(values);
    }
    return result;
  }

  /**
   * Save a new model and return the instance.
   *
   * @param Object attributes
   *
   * @return Object
   */
  async create(attributes) {
    if (_.isNil(attributes)) {
      throw new Exception('attributes should not empty', 1000);
    }

    const result = await this.Models().sequelize.transaction(
      function(t) {
        return this.Models().create(attributes, { transaction: t });
      }.bind(this)
    );
    if (_.isNil(result)) {
      throw new Exception('Can not create resource', 1004);
    }

    return result;
  }
  /**
   * Update multiple instances that match the where options
   *
   * @param Object attributes
   * @param ID optinal
   *
   * @return Object
   */
  async update(attributes, id = undefined) {
    let result;
    if (_.isNil(attributes)) {
      throw new Exception('attributes should not empty', 1000);
    }
    if (_.isUndefined(id)) {
      result = await this.Models().update(attributes, {
        where: this.getWheres()
      });
    } else {
      const item = await this.findById(id);
      result = await item.update(attributes);
    }
    return result;
  }

  /**
   * Get the first record
   *
   * @return Object
   */
  async first() {
    let params = {
      where: this.getWheres(),
      include: this.getIncludes(),
      order: this.getOrders()
    };

    if (!_.isArray(this.getAttributes()) && this.getAttributes().length > 0) {
      params = _.assign(params, { attributes: this.getAttributes() });
    }
    let model = this.Models();
    if (this.getScopes().length > 0) {
      _.forEach(this.getScopes(), scope => {
        model = model.scope(scope);
      });
    }
    const result = await model.findOne(params);
    return result;
  }

  /**
   * Execute the query and get the first result or throw an exception
   *
   * @return Object
   */
  async firstOrFail() {
    const result = this.first();
    if (!result) {
      throw new NotFoundException('Resource');
    }
    return result;
  }

  /**
   * Find a model by its primary key.
   *
   * @param int id
   *
   * @return Boolean
   * @throws Exception
   */
  async findById(id) {
    let params = {
      where: {
        id: id
      },
      include: this.getIncludes()
    };
    if (!_.isArray(this.getAttributes()) && this.getAttributes().length > 0) {
      params = _.assign(params, { attributes: this.getAttributes() });
    }
    let model = this.Models();
    if (this.getScopes().length > 0) {
      _.forEach(this.getScopes(), scope => {
        model = model.scope(scope);
      });
    }
    const result = await model.findOne(params);
    console.log(result);

    if (!result) {
      throw new NotFoundException('Resource');
    }
    return result;
  }

  /**
   * Delete a model by its primary key.
   *
   * @param int id
   *
   * @return Boolean
   * @throws Exception
   */
  async deleteById(id) {
    const item = await this.findById(id);
    const result = await item.destroy();
    if (result === false) {
      throw new Exception('can not delete resource', 1002);
    }
    return result;
  }

  /**
   * Find by id include deleted
   *
   * @param int id
   *
   * @return model
   * @throws Exception
   */
  async findByIdIncludeDeleted(id) {
    const result = await this.Models().find({ where: { id: id }, paranoid: false });
    return result;
  }

  /**
   * Delete resources by given condition
   *
   * @return Boolean
   * @throws Exception
   */
  async delete() {
    const result = await this.Models().destroy({
      where: this.getWheres()
    });

    return result;
  }

  /**
   * Execute the query as a "select" statement.
   *
   * @return Array
   */
  async get() {
    let params = {
      where: this.getWheres(),
      include: this.getIncludes(),
      order: this.getOrders(),
      group: this.getGroup()
    };

    if (!_.isArray(this.getAttributes()) && this.getAttributes().length > 0) {
      params = _.assign(params, { attributes: this.getAttributes() });
    }
    let model = this.Models();
    if (this.getScopes().length > 0) {
      _.forEach(this.getScopes(), scope => {
        model = model.scope(scope);
      });
    }
    const result = await model.findAll(params);

    return result;
  }

  /**
   * Retrieve the "count" result of the query.
   *
   * @return int
   */
  async count() {
    const params = {
      where: this.getWheres(),
      include: this.getIncludes(),
      order: this.getOrders(),
      distinct: true
    };
    let model = this.Models();
    if (this.getScopes().length > 0) {
      _.forEach(this.getScopes(), scope => {
        model = model.scope(scope);
      });
    }
    const result = await model.count(params);
    return result;
  }
  /**
   * Paginate the given query.
   *
   * @param  int  per_page
   * @param  int|null  page
   *
   * @return LengthAwarePaginator
   */
  async paginate(per_page = null, page = null) {
    if (!_.isNil(per_page)) {
      per_page = parseInt(per_page);
    } else {
      if (Request.has('per_page')) {
        per_page = parseInt(Request.get('per_page'));
      } else {
        per_page = 20;
      }
    }
    if (!_.isNil(page)) {
      page = parseInt(page);
    } else {
      if (Request.has('page')) {
        page = parseInt(Request.get('page'));
      } else {
        page = 1;
      }
    }
    let params = {
      offset: (page - 1) * per_page,
      limit: per_page,
      where: this.getWheres(),
      include: this.getIncludes(),
      order: this.getOrders(),
      distinct: true
    };

    if (!_.isArray(this.getAttributes()) && this.getAttributes().length > 0) {
      params = _.assign(params, { attributes: this.getAttributes() });
    }
    let model = this.Models();
    if (this.getScopes().length > 0) {
      _.forEach(this.getScopes(), scope => {
        model = model.scope(scope);
      });
    }
    const result = await model.findAndCountAll(params);

    const paginator = new LengthAwarePaginator(result.rows, result.count, per_page, page);
    return paginator;
  }

  /**
   * Add a basic "WHERE" clause to the query.
   *
   * @param  string  column
   * @param  mixed   operator
   * @param  mixed   value
   *
   * @return this
   */
  where(...args) {
    if (args.length === 1) {
      let raw = false;
      if (args[0].constructor) {
        if (args[0].constructor.name === 'Where') {
          raw = true;
        } else if (args[0].constructor.name === 'Literal') {
          raw = true;
        }
      }
      if (raw) {
        this.builder.where.apply(this.builder, [...args]);
      } else {
        const callable = args[0];
        const builder = new QueryBuilder();
        const query = callable(builder);
        this.builder.scopeQuery.apply(this.builder, [query]);
      }
    } else {
      this.builder.where.apply(this.builder, [...args]);
    }
    return this;
  }
  /**
   * make a date search for a column ignoring the time
   * if date is not array of date, then we search for value between that day from 00:00 on that day until tomorrow 00:00 dawn
   * if date is array with 1 param, then we search for value between array[0] date (casted to 00:00 that day) until tomorrow 00:00 dawn
   * if date is array with 2 params, then we search for value between array[0] date (casted to 00:00 that day) until array[1] (casted to 00:00 that next day)
   * @param  string  column
   * @param  mixed   date
   *
   * @return this
   */
  whereBetweenDate(field, date) {
    const zeroTime = { h: 0, m: 0, s: 0, ms: 0 };
    if (Array.isArray(date)) {
      if (date.length > 0) {
        if (date.length === 2) {
          if (moment.utc(date[1]).diff(moment.utc(date[0])) < 0) {
            throw new Exception('whereBetweenDate expect second date more than first date');
          }
        }
        let fromDate = moment.utc(date[0]).set(zeroTime);
        let toDate = moment
          .utc(new Date())
          .set(zeroTime)
          .add(1, 'days');
        if (date.length > 1) {
          toDate = moment
            .utc(date[1])
            .set(zeroTime)
            .add(1, 'days');
        }
        this.where(field, 'between', [fromDate.toDate(), toDate.toDate()]);
      }
    } else {
      let momentDate = moment.utc(date).set(zeroTime);
      this.where(field, 'between', [momentDate.toDate(), momentDate.add(1, 'days').toDate()]);
    }
    return this;
  }
  /**
   * Add an "OR WHERE" clause to the query.
   *
   * @param  string  column
   * @param  string|null  operator
   * @param  mixed   value
   *
   * @return this
   */
  orWhere(...args) {
    this.builder.orWhere.apply(this.builder, [...args]);
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
    this.builder.whereIn(column, value);
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
    this.builder.whereNotIn(column, value);
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
  whereHas(relation, callable) {
    let builder = new QueryBuilder();
    builder = callable(builder);
    this.builder.whereHas.apply(this.builder, [relation, builder]);
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
    this.builder.skip(offset);
    return this;
  }

  /**
   * Alias to set the "limit" value of the query.
   *
   * @param  int  value
   *
   * @return this
   */
  take(limit) {
    this.builder.take(limit);
    return this;
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
      this.builder.orderBy(field, direction);
    }
    if (args.length === 3) {
      [model, field, direction] = args;
      this.builder.orderBy(model, field, direction);
    }
    if (args.length === 1) {
      [field] = args;
      this.builder.orderBy(field);
    }
    return this;
  }

  /**
   * Add an "GROUP BY" clause to the query.
   *
   * @param  string  column
   *
   * @return this
   */
  groupBy(column) {
    this.builder.groupBy(column);
    return this;
  }

  /**
   * Extract order param from request and apply the rule
   *
   * @param Array Supported fields to order
   *
   * @return Repository
   */
  applyOrderFromRequest(fields = [], functions = {}) {
    if (Request.has('sort') && Request.get('sort') !== '') {
      const orderBy = Request.get('sort').split(',');
      orderBy.forEach(field => {
        let direction = 'ASC';
        if (field.charAt(0) === '-') {
          direction = 'DESC';
          field = field.slice(1);
        }
        if (field.charAt(0) === '+') {
          field = field.slice(1);
        }
        if (fields.length === 0 || (fields.length > 0 && _.includes(fields, field))) {
          // custom functions to be given aligned with field name
          if (typeof functions[field] !== 'undefined') {
            functions[field](direction);
          } else {
            this.orderBy(field, direction);
          }
        }
      });
    }
    return this;
  }

  /**
   * Extract search param from request and apply the rule
   *
   * @param Array Supported fields to order
   *
   * @return Repository
   */
  applySearchFromRequest(fields, match = null) {
    if (Request.has('search') && Request.get('search') !== '') {
      if (_.isNull(match)) {
        match = `%${Request.get('search')}%`;
      }
      this.where(function(q) {
        _.forEach(fields, field => {
          q.orWhere(field, 'like', match);
        });
        return q;
      });
    }
    return this;
  }

  /**
   * Extract constraints param from request and apply the rule
   * @param custom => object consisting key of entity type with custom implementation as the value
   * when supplied custom, it will check from the custom object for its implementation function instead of default where
   * @return Repository
   */
  applyConstraintsFromRequest(custom = {}) {
    if (Request.has('constraints') || Request.get('constraints') !== '') {
      const data = Request.get('constraints', {});
      let constraints = {};
      if (typeof data === 'object') {
        constraints = Request.get('constraints');
      } else {
        constraints = JSON.parse(Request.get('constraints'));
      }
      for (const key in constraints) {
        if (typeof custom[key] !== 'undefined') {
          custom[key](constraints[key]);
        } else {
          this.where(key, constraints[key]);
        }
      }
      return this;
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
    this.builder.with.apply(this.builder, args);
    return this;
  }

  /**
   * Begin querying a model with eager loading. using sequelize given format
   *
   * @param  array|string  $relations
   *
   * @return this
   */
  rawWith(args) {
    this.builder.rawWith.call(this.builder, args);
    return this;
  }
  /**
   * Add scope to the query
   *
   * @param  string scope
   *
   * @return this
   */
  withScope(scope) {
    this.builder.withScope(scope);
    return this;
  }
  /**
   * Set the columns to be selected.
   *
   * @param  array|mixed  $columns
   *
   * @return this
   */
  select(columns) {
    this.builder.select.apply(this.builder, [columns]);
    return this;
  }
  /**
   * Get the sequilize where condition
   *
   * @return Object
   */
  getWheres() {
    return this.builder.buildWhereQuery();
  }
  /**
   * Get the limit value of the builder
   *
   * @return int
   */
  getLimit() {
    return this.builder.limit;
  }
  /**
   * Get the offset value of the builder
   *
   * @return int
   */
  getOffset() {
    return this.builder.offset;
  }
  /**
   * Get the orders value of the builder
   *
   * @return array
   */
  getOrders() {
    return this.builder.orders;
  }
  /**
   * Get the group value of the builder
   *
   * @return array
   */
  getGroup() {
    return this.builder.group;
  }
  /**
   * Get the includes value of the builder
   *
   * @return array
   */
  getIncludes() {
    return this.builder.includes;
  }
  /**
   * Get the scopes value of the builder
   *
   * @return array
   */
  getScopes() {
    return this.builder.scopes;
  }
  /**
   * Get the attributes value of the builder
   *
   * @return array
   */
  getAttributes() {
    return this.builder.attributes;
  }
}
