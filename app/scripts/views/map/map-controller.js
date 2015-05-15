(function() {
    'use strict';

    /**
     * Controller for the gw app map view
     */
    /* ngInject */
    function MapController($log, Config, SQLFilter) {

        var ctl = this;
        var vis = null;
        var cdbSubLayer = {};
        var sqlFilter = new SQLFilter({
            tableName: 'master_datalist'
        });
        initialize();

        function initialize() {
            cartodb.createVis('map', 'https://greenworks.cartodb.com/api/v2/viz/33627780-f988-11e4-8ff7-0e0c41326911/viz.json')
                .done(onVisReady, onVisError);
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
