
(function() {
    'use strict';

    /**
     * Controller for the gw app root view -- handles header bar and search bar logic
     */
    /* ngInject */
    function RootController($log, $state, Geocoder) {

        var ctl = this;

        initialize();

        function initialize() {
            ctl.searchText = '';
            ctl.suggest = Geocoder.suggest;
            ctl.search = search;
        }

        function search(searchText, magicKey) {
            Geocoder.search(searchText, magicKey)
            .then(loadMap)
            .catch(function (error) {
                $log.debug('Error searching:', error);
            });
        }

        function loadMap(results) {
            if (results && results.length) {
                var result = results[0];
                $log.debug(result);

                var sw = L.latLng(result.extent.ymin, result.extent.xmin);
                var ne = L.latLng(result.extent.ymax, result.extent.xmax);
                var bounds = L.latLngBounds(sw, ne);
                $state.go('map', { bbox: bounds.toBBoxString() });
            }
        }
    }

    angular.module('gw.views.root')
    .controller('RootController', RootController);
})();
