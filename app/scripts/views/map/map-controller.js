(function() {
    'use strict';

    /**
     * Controller for the gw app map view
     */
    /* ngInject */
    function MapController($log, $timeout, $stateParams, Categories, Config, Sections, SQLFilter) {

        var ctl = this;
        var vis = null;
        var map = null;
        var geocodeMarker = null;
        var cdbLayer = {};
        var cdbSubLayer = {};
        var sqlFilter = new SQLFilter({
            tableName: 'master_datalist'
        });
        initialize();

        function initialize() {
            ctl.categories = {};
            ctl.filters = [];
            ctl.sections = Sections;
            ctl.showCategories = false;
            ctl.showFilters = true;
            ctl.toggles = {
                // Namespace because some project and subcategories have the same names
                'project': {},
                'sub': {}
            };
            ctl.open = {};      // accordion toggle state

            ctl.iconForCategory = Categories.getIcon;
            ctl.hasBackground = Categories.hasBackground;

            ctl.onProjectFilterClicked = onProjectFilterClicked;
            ctl.onSearchResult = onSearchResult;
            ctl.onSubFilterClicked = onSubFilterClicked;
            ctl.onResetClicked = onResetClicked;
            ctl.onClearClicked = onClearClicked;
            ctl.onHeaderClicked = onHeaderClicked;

            cartodb.createVis('map', 'https://greenworks.cartodb.com/api/v2/viz/3a833566-03c1-11e5-a4dd-0e4fddd5de28/viz.json')
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
                toggleSubKey(subKey, val);
            });
            updateFilter();
        }

        function onSubFilterClicked(key) {
            toggleSubKey(key, !ctl.toggles.sub[key]);
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

        // Any time a sub key it set, it must be done via this method
        // so that the check for special keys occurs
        function toggleSubKey(key, value) {
            ctl.toggles.sub[key] = value;

            // Special case for bike lanes and bike trails
            // bike lanes switch controls visibility for these layers
            if (key === 'Bike Lanes') {
                setSublayerVisibility(Config.cartodb.layers.bikeLanes, ctl.toggles.sub[key]);
            } else if (key === 'Bike Trails') {
                setSublayerVisibility(Config.cartodb.layers.bikeTrails, ctl.toggles.sub[key]);
            }
        }

        function setSublayerVisibility(layerId, visibility) {
            var layer = cdbLayer.getSubLayer(layerId);
            if (visibility === true) {
                layer.show();
            } else {
                layer.hide();
            }
        }

        function onVisReady(newVis) {
            vis = newVis;

            // Set bounds if applicable
            map = vis.getNativeMap();
            if ($stateParams.lat && $stateParams.lng && $stateParams.zoom) {
                var lat = parseFloat($stateParams.lat);
                var lng = parseFloat($stateParams.lng);
                var zoom = parseInt($stateParams.zoom, 10);
                var latLng = L.latLng(lat, lng);
                onSearchResult(latLng, zoom);
            }

            // Set cartodb layers and sql
            var layerId = Config.cartodb.layerId;
            var categoriesLayerId = Config.cartodb.layers.categories;
            cdbLayer = vis.getLayers()[layerId];
            cdbSubLayer = cdbLayer.getSubLayer(categoriesLayerId);
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
                toggleSubKey(key, value);
            });
            angular.forEach(ctl.toggles.project, function (v, key) {
                ctl.toggles.project[key] = value;
            });
            updateFilter();
        }

        function onHeaderClicked(headerKey) {
            if (ctl.open[headerKey] === true) {
                ctl.open[headerKey] = false;
            } else {
                angular.forEach(ctl.open, function (value, key) {
                    ctl.open[key] = false;
                });
                ctl.open[headerKey] = true;
            }
        }

        function onSearchResult(center, zoom) {
            map.setView(center, zoom);
            if (!geocodeMarker) {
                geocodeMarker = L.marker(center);
                geocodeMarker.addTo(map);
            } else {
                geocodeMarker.setLatLng(center);
            }
        }
    }

    angular.module('gw.views.map')
    .controller('MapController', MapController);

})();
