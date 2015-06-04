(function() {
    'use strict';

    /**
     * Controller for the gw app map view
     */
    /* ngInject */
    function MapController($log, $timeout, $stateParams, Categories, Config, Geocoder, SQLFilter) {

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
            ctl.open = {};      // accordion toggle state

            ctl.onProjectFilterClicked = onProjectFilterClicked;
            ctl.onSubFilterClicked = onSubFilterClicked;
            ctl.onResetClicked = onResetClicked;
            ctl.onClearClicked = onClearClicked;
            ctl.onHeaderClicked = onHeaderClicked;

            cartodb.createVis('map', 'https://greenworks.cartodb.com/api/v2/viz/33627780-f988-11e4-8ff7-0e0c41326911/viz.json')
                .done(onVisReady, onVisError);

            var sql = new cartodb.SQL({ user: Config.cartodb.user });
            Categories.get(sql).then(function (categories) {
                ctl.categories = categories;
                ctl.toggles.project = Categories.allProjectKeys();
                ctl.toggles.sub = Categories.allSubKeys();

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

            var subKeys = Categories.getKeysForCategory(ctl.categories, key);
            angular.forEach(subKeys, function (subKey) {
                ctl.toggles.sub[subKey] = val;
            });
            updateFilter();
        }

        function onSubFilterClicked(key) {
            ctl.toggles.sub[key] = !ctl.toggles.sub[key];
            var projKey = Categories.getSubcategoryParentKey(key);
            // if subKey is now true, set parent to true
            if (ctl.toggles.sub[key] === true) {
                ctl.toggles.project[projKey] = true;
            // else we need to check if all the subkeys are false now, and if so,
            // set parent to false
            } else {
                var subKeys = Categories.getKeysForCategory(ctl.categories, projKey);
                var allFalse = _.every(subKeys, function (subKey) {
                    return ctl.toggles.sub[subKey] === false;
                });
                if (allFalse) {
                    ctl.toggles.project[projKey] = false;
                }
            }

            updateFilter();
        }

        function onVisReady(newVis) {
            vis = newVis;

            // Set bounds if applicable
            var map = vis.getNativeMap();
            var bbox = $stateParams.bbox ? $stateParams.bbox.split(',') : [];
            if (bbox && bbox.length === 4) {
                var bounds = L.latLngBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]]);
                map.fitBounds(bounds);
            }

            // Set cartodb layers and sql
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

        function onHeaderClicked(headerKey) {
            angular.forEach(ctl.open, function (value, key) {
                ctl.open[key] = false;
            });
            ctl.open[headerKey] = true;
        }

    }

    angular.module('gw.views.map')
    .controller('MapController', MapController);

})();
