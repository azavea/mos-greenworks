/**
 * Get and store the configuration for data section, projects and subcategories
 * Stores data as tree and list
 *
 * Categories contains two special cases, Bike Lanes and Bike Trails, which are handled in
 * MapController
 *
 * Usage:
 *     Get data with get(), then use other helper methods after promise resolves
 *
 * TODO: Allow all helper methods to be called before or concurrent with a get() call
 *
 */
(function () {
    'use strict';

    /* ngInject */
    function Categories ($log, $q, Config) {

        var iconUrl = 'https://s3.amazonaws.com/s3.azavea.com/images/gwicons/:icon.svg';
        var iconMap = {
            // Energy
            'City LEED building': 'ic_leed',
            'Guaranteed Energy Savings Project': 'ic_energySavings',
            'Municipal Energy Efficiency Project': 'ic_energyEfficiency',
            'Greenworks Small Business Loan': 'ic_loans',
            'SEPTA Energy Management': 'ic_energyManagement',
            'Philadelphia International Airport Renewable Energy': 'ic_airRenewable',
            'Philadelphia Water Department Renewable Energy': 'ic_pwdRenewable',
            'Privately-Owned Solar Project': 'ic_solar',
            // Environment
            'Air Monitoring Station': 'ic_airMonitor',
            'Alternative Energy Vehicle Fueling Station': 'ic_altEnergy2',
            'SEPTA Hybrid Bus Depot': 'ic_hybridBus',
            'Big Belly Solar-Powered Trash Compactor/Recycling Bin': 'ic_bigBelly',
            'Local Composting': 'ic_localComposting',
            'Recycling Convenience Center': 'ic_recycling',
            // Equity
            'Commercial Kitchen Center': 'ic_commercialKitchen',
            'Farmers Market': 'ic_farmersMarket',
            'Food Co-op': 'ic_foodCoop',
            'New Supermarket': 'ic_supermarket',
            'Philadelphia Prison Orchard Project': 'ic_orchard',
            'Public Food Market': 'ic_publicFoodMarket',
            'Non-Residential Stormwater Management Project': 'ic_nonResWater',
            'Residential Stormwater Management Project': 'ic_resWater',
            'New Street Tree': 'ic_street_tree',
            'New Yard Tree': 'ic_yard_tree',
            'Ecological Restoration Site': 'ic_stream',
            'Forest Restoration': 'ic_ecological',
            'New Park Space': 'ic_park',
            'Public Space': 'ic_publicSpace',
            'Stream Restoration and Wetland Creation Project': 'ic_stormwater2',
            'Trail': 'ic_bike_trail',
            // Economy
            'Bicycle Infrastructure': 'ic_bike',
            'Bike Lane': 'ic_bike_lane',
            'Indego Station': 'ic_indego4',
            'Pedestrian Space': 'ic_pedestrian',
            'SEPTA Climate Resilience': 'ic_climateResilience',
            // Engagement
            'Community Composting Sites': 'ic_composting'
        };
        var noIconBackground = [
            Config.bikeLaneKey,
            Config.bikeTrailKey,
            'New Street Tree',
            'New Yard Tree'
        ];

        var categoriesList = null;
        var categoriesTree = null;
        var categoriesQuery = [
            'SELECT COUNT(*), section, project_category, sub_category FROM ' +
            Config.cartodb.table + ' ',
            'GROUP BY section, project_category, sub_category',
            'ORDER BY section, project_category, sub_category'
        ].join(' ');

        var module = {
            get: get,
            getIcon: getIcon,
            getSubcategoryParentKey: getSubcategoryParentKey,
            allProjectKeys: allProjectKeys,
            allSubKeys: allSubKeys,
            getKeysForCategory: getKeysForCategory,
            hasBackground: hasBackground
        };
        return module;

        /**
         * Get and parse categories from a passed cartodb.sql object
         * @param  {cartodb.SQL} sql
         * @return {$q promise}  promise that resolves with parse category tree
         */
        function get(sql) {
            var dfd = $q.defer();
            if (categoriesTree) {
                dfd.resolve(categoriesTree);
            } else {
                sql.execute(categoriesQuery).done(function (data) {
                    categoriesList = addSpecialCases(data.rows);
                    var newCategories = parseResponse(categoriesList);
                    categoriesTree = newCategories;
                    dfd.resolve(categoriesTree);
                }).error(function (error) {
                    dfd.reject(error);
                });
            }
            return dfd.promise;
        }

        function getIcon(subCategory) {
            var icon = iconMap[subCategory];
            if (!icon) {
                return null;
            }
            return iconUrl.replace(':icon', icon);
        }

        /**
         * Get the parent of a subcategory
         *
         * @param  {string} subCategory sub category to get the parent key for
         * @return {string}             project category key that owns the sub category
         */
        function getSubcategoryParentKey(subCategory) {
            if (!categoriesList) {
                return null;
            }
            var category = _.find(categoriesList, function (c) {
                /* jshint camelcase: false*/
                return c.sub_category === subCategory;
                /* jshint camelcase: true */
            });
            /* jshint camelcase: false*/
            return category ? category.project_category : null;
            /* jshint camelcase: true*/
        }

        /**
         * Helper to retrive all product_category keys (at the second level)
         */
        function allProjectKeys() {
            var keys = {};
            angular.forEach(categoriesTree, function (value) {
                var prodKeys = _.mapValues(value, function () {
                    return true;
                });
                angular.extend(keys, prodKeys);
            });
            return keys;
        }

        /**
         * Helper function to create a single depth object of subcategory keys
         * Defaults all keys to enabled
         */
        function allSubKeys() {
            var keys = {};
            angular.forEach(categoriesList, function (category) {
                /* jshint camelcase: false*/
                var key = category.sub_category;
                /* jshint camelcase: true*/
                keys[key] = true;
            });
            return keys;
        }
        /**
         * Helper to retrieve all child keys for a given category
         *
         * Static method
         *
         * Takes top level categories object
         *
         * @param  {[type]} categories [description]
         * @return {[type]}            [description]
         */
        function getKeysForCategory(categories, searchKey) {
            var keys = [];
            angular.forEach(categories, function (value, key) {
                if (searchKey === key) {
                    keys = keys.concat(_.keys(value));
                } else {
                    keys = keys.concat(getKeysForCategory(value, searchKey));
                }
            });
            return keys;
        }

        function hasBackground(key) {
            return _.indexOf(noIconBackground, key) === -1;
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

        // Add the two special cases, the toggles who have data displayed in separate
        // cartodb vis layers.
        // Only adds them if they don't exist in the response already
        // Protects against these sub_categories not existing in the response from
        // the 'master_datalist' table
        function addSpecialCases(rows) {
            /* jshint camelcase: false */
            if (!_.find(rows, function (row) { return row.sub_category === Config.bikeLaneKey; } )) {
                rows.push({
                    count: 4063,
                    project_category: 'Bicycle and Pedestrian Infrastructure',
                    section: 'Economy',
                    sub_category: Config.bikeLaneKey
                });
            }
            if (!_.find(rows, function (row) { return row.sub_category === Config.bikeTrailKey; } )) {
                rows.push({
                    count: 44,
                    project_category: 'Bicycle and Pedestrian Infrastructure',
                    section: 'Equity',
                    sub_category: Config.bikeTrailKey
                });
            }
            /* jshint camelcase: true */
            return rows;
        }
    }

    angular.module('cartodb')
    .service('Categories', Categories);

})();
