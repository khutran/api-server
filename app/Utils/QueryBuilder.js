import * as _ from "lodash";
import { Exception } from "../Exceptions/Exception";
import models from "../../models";
import { Op } from "sequelize";

export class QueryBuilder {
    constructor() {
        this.wheres = [];
        this.scopes = [];
        this.offset = 0;
        this.limit = 10;
        this.orders = [];
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
        let type = Op.and;
        let column;
        let operation = "=";
        let value;
        if (args.length === 2) {
            [column, value] = [args[0], args[1]];
        } else if (args.length === 3) {
            [column, operation, value] = args;
        } else {
            throw new Exception("where function expect two or three parameters", 1000);
        }
        this.wheres.push({ column, operation, value, type });
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
        let type = Op.or;
        let column;
        let operation = "=";
        let value;
        if (args.length === 2) {
            [column, value] = [args[0], args[1]];
        } else if (args.length === 3) {
            [column, operation, value] = args;
        } else {
            throw new Exception("orWhere function expect two or three parameters", 1000);
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
        let operation = Op.in;
        let type = Op.and;
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
    whereHas(relation, callable) {
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
    orderBy(field, direction = "ASC") {
        this.orders.push([field, direction]);
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
    select(...args) {
        if (_.isArray(args[0])) {
            args = args[0];
        }

        this.attributes = args;
    }

    resolveOperation(operation) {
        switch (operation) {
            case "=":
                return Op.eq;
            case ">":
                return Op.gt;
            case "<":
                return Op.lt;
            case ">=":
                return Op.gte;
            case "<=":
                return Op.lte;
            case "<>":
                return Op.ne;
            case "like":
                return Op.like;
            default:
                return operation;
        }
    }

    buildWhereQuery() {
        let query = {};

        let group = _.groupBy(this.wheres, "type");
        if (this.wheres.length === 0) {
            return query;
        }

        if (!_.isUndefined(group[Op.or]) && group[Op.or].length > 0) {
            query = {
                [Op.or]: []
            };
            if (!_.isUndefined(group[Op.and]) && group[Op.and].length > 0) {
                let andQuery = {};
                _.forEach(group[Op.and], item => {
                    andQuery[item.column] = {
                        [this.resolveOperation(item.operation)]: item.value
                    };
                });
                query[Op.or].push({
                    [Op.and]: andQuery
                });
            }
            _.forEach(group[Op.or], item => {
                query[Op.or].push({
                    [item.column]: {
                        [this.resolveOperation(item.operation)]: item.value
                    }
                });
            });
        } else {
            query = {
                [Op.and]: []
            };
            _.forEach(group[Op.and], item => {
                query[Op.and].push({
                    [item.column]: {
                        [this.resolveOperation(item.operation)]: item.value
                    }
                });
            });
        }
        return query;
    }

    with(model) {
        this.includes.push({ 'model': models[model] });
        return this;
    }

    // withAttributes(model, attributes) {
    //     attributes = _.split(attributes, ':');
    //     this.includes.push({ 'model': models[model], attributes: attributes });
    //     return this;
    // }

    // withAlias(model, alias) {
    //     this.includes.push({ 'model': models[model], as: alias });
    //     return this;
    // }

    // with(...args) {
    //     if (_.isArray(args[0])) {
    //         args = args[0];
    //     }
    // }
}