(function() {
    'use strict';

    /**
     * Controller for the gw app map view
     */
    /* ngInject */
    function MapController($log, $timeout, Categories, Config, SQLFilter) {

        var ctl = this;
        var vis = null;
        var cdbSubLayer = {};
        var sqlFilter = new SQLFilter({
            tableName: 'master_datalist'
        });
        initialize();

        function initialize() {
            ctl.categories = {};
            ctl.filters = [];
            ctl.showCategories = false;
            ctl.toggles = {
                // Namespace because some project and subcategories have the same names
                'project': {},
                'sub': {}
            };

            ctl.onProjectFilterClicked = onProjectFilterClicked;
            ctl.onSubFilterClicked = onSubFilterClicked;
            ctl.onResetClicked = onResetClicked;
            ctl.onClearClicked = onClearClicked;

            cartodb.createVis('map', 'https://greenworks.cartodb.com/api/v2/viz/33627780-f988-11e4-8ff7-0e0c41326911/viz.json')
                .done(onVisReady, onVisError);

            Categories.get().then(function (categories) {
                ctl.categories = categories;
                ctl.toggles.project = allProjectKeys(ctl.categories);
                ctl.toggles.sub = allKeysFromCategories(ctl.categories);

                // Cheat and delay showing filters for one more digest cycle
                // No matter what I can't seem to get the unstyled/open categories flash to
                // go away
                $timeout(function () {
                    ctl.showCategories = true;
                });
            });
        }

        function onProjectFilterClicked(key) {
            ctl.toggles.project[key] = !ctl.toggles.project[key];
            var val = ctl.toggles.project[key];

            var subKeys = getKeysForCategory(ctl.categories, key);
            angular.forEach(subKeys, function (subKey) {
                ctl.toggles.sub[subKey] = val;
            });
            updateFilter();
        }

        function onSubFilterClicked(key) {
            ctl.toggles.sub[key] = !ctl.toggles.sub[key];
            updateFilter();
        }

        function onVisReady(newVis) {
            vis = newVis;
            var layerId = Config.cartodb.layerId;
            var sublayerId = Config.cartodb.sublayerId;
            cdbSubLayer = vis.getLayers()[layerId].getSubLayer(sublayerId);
            cdbSubLayer.setInteraction(true);
            cdbSubLayer.setSQL(sqlFilter.makeSql());
        }

        function onVisError(error) {
            $log.error(error);
        }

        function updateFilter() {
            var filterList = _(ctl.toggles.sub)
                .pick(function (value) { return value; })
                .keys()
                .value();

            sqlFilter.setWhere({ list: filterList });
            if (cdbSubLayer) {
                cdbSubLayer.setSQL(sqlFilter.makeSql());
            }
        }

        function onResetClicked() {
            setAllToggles(true);
        }

        function onClearClicked() {
            setAllToggles(false);
        }

        function setAllToggles(value) {
            angular.forEach(ctl.toggles.sub, function (v, key) {
                ctl.toggles.sub[key] = value;
            });
            angular.forEach(ctl.toggles.project, function (v, key) {
                ctl.toggles.project[key] = value;
            });
            updateFilter();
        }

        /**
         * Helper to retrieve keys for a given product category
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

        /**
         * Helper to retrive all product_category keys (at the second level)
         */
        function allProjectKeys(categories) {
            var keys = {};
            angular.forEach(categories, function (value) {
                var prodKeys = _.mapValues(value, function () {
                    return true;
                });
                angular.extend(keys, prodKeys);
            });
            return keys;
            /*
            //play with this later
            var data = _(categories).values()
                .map(function(k) { return _.keys(k); })
                .flatten()
                .mapValues(function () { return true; })
                .value();
            $log.debug(data);
            return data;
            */
        }

        /**
         * Helper function to create a single depth object of subcategory keys
         * Defaults all keys to enabled
         */
        function allKeysFromCategories(categories) {
            var keys = {};
            angular.forEach(categories, function (value, key) {
                if (value instanceof Object) {
                    angular.extend(keys, allKeysFromCategories(value));
                } else {
                    keys[key] = true;
                }
            });
            return keys;
        }
    }

    angular.module('gw.views.map')
    .controller('MapController', MapController);

})();
