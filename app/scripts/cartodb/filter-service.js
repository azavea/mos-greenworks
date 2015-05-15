/**
 * Helper class to generate sql queries filtered using
 * column in list queries
 *
 * Both the constructor and makeSql() take a SQLFilterOptions object, defaults are the example
 * values below:
 * {
 *     tableName: 'master_datalist',
 *     displayFields: ['*'],        // Array of columns to add to SELECT clause
 *     where: {
 *         column: 'sub_category',  // String column to do the where ... IN(..) on
 *         list: []                 // List of values in the column to filter on
 *                                  // If empty, no where clause is added
 *     }
 * }
 *
 * Usage Examples:
 *
 * var sqlFilter = new SQLFilter({
 *     tableName: 'master_datalist',
 *     where: {
 *         column: 'section',
 *         list: ['Energy', 'Environment']
 *     }
 * });
 * cartodbSubLayer.setSQL(sqlFilter.makeSql())
 *
 * // Directly pass options to makeSql
 * cartodbSubLayer.setSQL(sqlFilter.makeSql({
 *     where: {
 *         column: 'sub_category',
 *         list: ['IndeGo Stations', 'Air Monitoring Stations']
 *     }
 * }))
 *
 * // Update defaults:
 * sqlFilter.setWhere({ column: 'sub_category' })
 * sqlFilter.setDisplayFields(['latitude', 'longitude', 'address'])
 *
 * // Revert to class defaults:
 * sqlFilter.setDisplayFields()
 * console.log(sqlFilter.displayFields)     // ['*']
 *
 */
(function () {
    'use strict';

    /* ngInject */
    function SQLFilter($log) {

        var defaults = {
            tableName: 'master_datalist',
            displayFields: ['*'],
            where: {
                column: 'sub_category',
                list: []
            }
        };

        /**
         * SQLFilter constructor
         * @param {SQLFilterOptions} options Options to override the defaults with
         */
        function Filter (options) {
            options = options || {};
            options.where = options.where || {};


            this.tableName = options.tableName || defaults.tableName;
            this.where = defaults.where;

            this.setDisplayFields(options.displayFields);
            this.setWhere(options.where);
        }

        /**
         * Set the default displayFields
         *
         * Does basic type checking for an array, if invalid param reverts option to default
         *
         * @param {Array} newFields Array of string columns to request in SELECT
         */
        Filter.prototype.setDisplayFields = function (newFields) {
            if (!(newFields instanceof Array)) {
                this.displayFields = defaults.displayFields;
                return;
            }
            this.displayFields = newFields;
        };

        /**
         * Set where clause options, subset of SQLFilterOptions
         *
         * @param {object} where Same as SQLFilterOptions.where
         */
        Filter.prototype.setWhere = function (where) {
            where = where || {};
            if (where.column && typeof where.column === 'string') {
                this.where.column = where.column;
            }
            if (where.list && where.list instanceof Array) {
                this.where.list = where.list;
            }
        };

        /**
         * Return string sql query based on instance/method options
         *
         * @param  {SQLFilterOptions} options options to override defaults with
         * @return {string}           SQL query to directly pass to cartodb setSQL
         */
        Filter.prototype.makeSql = function (options) {
            options = options || {};
            var displayFields = options.displayFields || this.displayFields;
            var where = options.where || this.where;
            var query = 'SELECT ' + displayFields.join(', ') + ' FROM ' + this.tableName;
            if (where.list.length > 0) {
                var list = wrapListQuotes(where.list);
                query += ' WHERE ' + where.column + ' IN (' + list.join(', ') + ')';
            }
            $log.debug('SQLFilter.makeSql(): ', query);
            return query;
        };

        return Filter;

        /**
         * Helper method to properly wrap string values in list with quotes
         *
         * Wraps strings in single quotes
         * Only adds strings and numbers to returned list
         *
         * @param  {Array} list Array of values to wrap
         * @return {Array]}     New list with properly wrapped values
         */
        function wrapListQuotes(list) {
            if (!(list instanceof Array)) {
                return [];
            }
            var wrappedList = [];
            angular.forEach(list, function (value) {
                if (typeof value === 'string') {
                    // Must be single quotes, cartodb errors on double quotes
                    wrappedList.push('\'' + value + '\'');
                } else if (typeof value === 'number') {
                    wrappedList.push(value);
                }
            });
            return wrappedList;
        }
    }

    angular.module('cartodb')
    .factory('SQLFilter', SQLFilter);

})();
