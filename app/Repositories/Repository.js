import * as _ from 'lodash';
import customsError from '../Exceptions/customsError';
import { LengthAwarePaginator } from '../Utils/LengthAwarePaginator';
import { QueryBuilder } from '../Utils/QueryBuilder';

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
      throw new customsError('attributes should not empty', 500);
    }

    let item = await this.Models().findOne({
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
      throw new customsError('attributes should not empty', 500);
    }

    let result = await this.Models().sequelize.transaction(
      function(t) {
        return this.Models().create(attributes, { transaction: t });
      }.bind(this)
    );

    return result;
  }

  async bulkCreate(attributesArr, individual = false) {
    let results = await this.Models().sequelize.transaction(
      function(t) {
        return this.Models().bulkCreate(attributesArr, {
          transaction: t,
          individualHooks: individual
        });
      }.bind(this)
    );

    return results;
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

    let result = await model.findOne(params);
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
    let item = await this.Models().findById(id);
    if (_.isNil(item)) {
      throw new customsError(`can not find the id ${id}`, 204);
    }
    return item;
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
    let item = await this.findById(id);
    let result = await item.destroy();
    if (result === false) {
      throw new customsError('can not delete resource', 500);
    }
    return result;
  }

  /**
   * Delete resources by given condition
   *
   * @return Boolean
   * @throws Exception
   */
  async delete() {
    if (!_.isArray(this.getWheres()) || this.getWheres().length === 0) {
      throw new customsError('can not delete resources without condition', 500);
    }

    let result = await this.Models().destroy({
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
      offset: this.getOffset(),
      limit: this.getLimit(),
      where: this.getWheres(),
      include: this.getIncludes(),
      order: this.getOrders()
    };

    if (!_.isArray(this.getAttributes()) && this.getAttributes().length > 0) {
      params = _.assign(params, { attributes: this.getAttributes() });
    }
    let result;
    let model = this.Models();
    if (this.getScopes().length > 0) {
      _.forEach(this.getScopes(), scope => {
        model = model.scope(scope);
      });
    }
    result = await model.findAll(params);

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
  async paginate(per_page = 10, page = 1) {
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

    let result = await model.findAndCountAll(params);

    let paginator = new LengthAwarePaginator(result.rows, result.count, per_page, page);
    return paginator;
  }

  async fromPagination(pagination) {
    let paginationObj = pagination.getData();
    paginationObj.operation.forEach(
      function(op) {
        this[op.type](...op.content);
      }.bind(this)
    );

    return pagination.result(this.paginate.bind(this));
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
    this.builder.where.apply(this.builder, [...args]);
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
   * Add a basic where clause with relation to the query.
   *
   * @param  string  relation
   * @param  callable callable
   *
   * @return this
   */
  // whereHas(relation, callable) {
  //   let builder = new QueryBuilder();
  //   builder = callable(builder);
  //   Log.info(builder.buildWhereQuery());
  //   return this;
  // }

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
  orderBy(field, direction = 'ASC') {
    this.builder.orderBy(field, direction);
    return this;
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
  select(...args) {
    this.builder.select.apply(this.builder, args);
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

  /**
   * Set the with to be selected.
   *
   * @param  string
   *
   * @return this
   */

  // with(model) {
  //     this.builder.with(model);
  //     return this;
  // }

  // /**
  //  * Set the with to be selected.
  //  *
  //  * @param  string|"column1:column2:column3"
  //  *
  //  * @return this
  //  */

  // withAlias(model, alias) {
  //     this.builder.withAlias(model, alias);
  //     return this;
  // }

  // /**
  //  * Set the with to be selected.
  //  *
  //  * @param  string|string     *
  //  * @return this
  //  */

  // withAttributes(model, attributes) {
  //     this.builder.withAttributes(model, attributes);
  //     return this;
  // }
}
