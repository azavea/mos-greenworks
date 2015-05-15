
(function () {
    'use strict';

    /* ngInject */
    function Categories ($log, $q, Config) {

        var categories = null;
        var categoriesQuery = [
            'SELECT COUNT(*), section, project_category, sub_category FROM master_datalist',
            'GROUP BY section, project_category, sub_category',
            'ORDER BY section, project_category, sub_category'
        ].join(' ');

        var sql = new cartodb.SQL({ user: Config.cartodb.user });
        var module = {
            get: get
        };
        return module;

        function get() {
            var dfd = $q.defer();
            if (categories) {
                dfd.resolve(categories);
            } else {
                sql.execute(categoriesQuery).done(function (data) {
                    var newCategories = parseResponse(data.rows);
                    categories = newCategories;
                    dfd.resolve(categories);
                }).error(function (error) {
                    dfd.reject(error);
                });
            }
            return dfd.promise;
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
            $log.debug(data);
            return data;
        }
    }

    angular.module('cartodb')
    .service('Categories', Categories);

})();
