
(function() {
    'use strict';

    /**
     * Controller for the gw app home view
     */
    /* ngInject */
    function HomeController($log, $state, Geocoder, Sections) {
        var ctl = this;

        initialize();

        function initialize() {
            ctl.searchText = '';
            ctl.suggest = Geocoder.suggest;
            ctl.search = search;

            ctl.sections = Sections;
        }

        function search(searchText, magicKey) {
            Geocoder.search(searchText, magicKey)
            .then(function (results) {
                if (results && results.length) {
                    var result = results[0];
                    var sw = L.latLng(result.extent.ymin, result.extent.xmin);
                    var ne = L.latLng(result.extent.ymax, result.extent.xmax);
                    var bounds = L.latLngBounds(sw, ne);
                    $state.go('map', { bbox: bounds.toBBoxString() });
                }
            })
            .catch(function (error) {
                $log.debug('Error searching:', error);
            });
        }
    }

    angular.module('gw.views.home')
    .controller('HomeController', HomeController);

})();