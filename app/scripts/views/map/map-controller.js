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

            cartodb.createVis('map', 'https://greenworks.cartodb.com/api/v2/viz/33627780-f988-11e4-8ff7-0e0c41326911/viz.json')
                .done(onVisReady, onVisError);

            Categories.get().then(function (categories) {
                ctl.categories = categories;
                ctl.filters =

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
            $log.debug(key);
            // TODO: Implement by project filtering logic
        }

        function onSubFilterClicked(key) {
            ctl.toggles.sub[key] = !ctl.toggles.sub[key];
            $log.debug(key);
            // TODO: Implement key filtering logic
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
    }

    angular.module('gw.views.map')
    .controller('MapController', MapController);

})();
