
(function () {
    'use strict';

    /* ngInject */
    function Categories ($log, $q, Config) {

        var categoriesList = null;
        var categoriesTree = null;
        var categoriesQuery = [
            'SELECT COUNT(*), section, project_category, sub_category FROM master_datalist',
            'GROUP BY section, project_category, sub_category',
            'ORDER BY section, project_category, sub_category'
        ].join(' ');

        var sql = new cartodb.SQL({ user: Config.cartodb.user });
        var module = {
            get: get,
            getSubcategoryParentKey: getSubcategoryParentKey
        };
        return module;

        function get() {
            var dfd = $q.defer();
            if (categoriesTree) {
                dfd.resolve(categoriesTree);
            } else {
                sql.execute(categoriesQuery).done(function (data) {
                    categoriesList = data.rows;
                    var newCategories = parseResponse(data.rows);
                    categoriesTree = newCategories;
                    dfd.resolve(categoriesTree);
                }).error(function (error) {
                    dfd.reject(error);
                });
            }
            return dfd.promise;
        }

        /**
         * Get the parent of a subcategory
         *
         * @param  {string} subCategory sub category to get the parent key for
         * @return {string}             project category key that owns the sub category
         */
        function getSubcategoryParentKey(subCategory) {
            var category = _.find(categoriesList, function (c) {
                return c.sub_category === subCategory;
            });
            return category ? category.project_category : null;
        }

        /**
         * Take the categories sql query and transform it to an object tree
         *
         * {
         *     'Energy': {
         *         'Energy Efficiency in City...': {
         *             'SEPTA Energy Management': <count>,
         *             ...
         *         },
         *         ...
         *     },
         *     ...
         * }
         *
         * @param  {object} response Response from sql.execute
         * @return {object}
         */
        function parseResponse(rows) {
            var data = {};
            angular.forEach(rows, function (row) {
                var count = row.count;
                var section = row.section;
                /* jshint camelcase:false */
                var projectCat = row.project_category;
                var subCat = row.sub_category;
                /* jshint camelcase:true */
                if (!data[section]) {
                    data[section] = {};
                }
                if (!data[section][projectCat]) {
                    data[section][projectCat] = {};
                }
                if (!data[section][projectCat][subCat]) {
                    data[section][projectCat][subCat] = count;
                }
            });
            return data;
        }
    }

    angular.module('cartodb')
    .service('Categories', Categories);

})();
