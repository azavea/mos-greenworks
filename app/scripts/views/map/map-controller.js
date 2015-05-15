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

            ctl.onFilterClick = onFilterClick;

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

        function onFilterClick(level, key) {

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
