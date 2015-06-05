
(function() {
    'use strict';

    /**
     * Controller for the gw app home view
     */
    /* ngInject */
    function HomeController($log, $state, Config, Geocoder, Sections) {

        var searchBBox = [
            Config.bounds.southWest.lng,
            Config.bounds.southWest.lat,
            Config.bounds.northEast.lng,
            Config.bounds.northEast.lat
        ].join(',');
        var searchBounds = L.latLngBounds(Config.bounds.southWest, Config.bounds.northEast);

        var ctl = this;

        initialize();

        function initialize() {
            ctl.searchText = '';
            ctl.suggest = Geocoder.suggest;
            ctl.search = search;

            ctl.onSearchButtonClicked = onSearchButtonClicked;

            ctl.sections = Sections;
        }

        function search(searchText, magicKey, options) {
            Geocoder.search(searchText, magicKey, options)
            .then(function (results) {
                if (results && results.length) {

                    $log.debug(results);
                    var result = results[0];
                    var latLng = L.latLng(result.feature.geometry.y, result.feature.geometry.x);
                    if (searchBounds.contains(latLng)) {
                        var sw = L.latLng(result.extent.ymin, result.extent.xmin);
                        var ne = L.latLng(result.extent.ymax, result.extent.xmax);
                        var bounds = L.latLngBounds(sw, ne);
                        $state.go('map', { bbox: bounds.toBBoxString() });
                    } else {
                        $log.debug('We could not find ' + searchText + ' near Philly');
                    }
                } else {
                    $log.debug('No results near Philly for ' + searchText);
                }
            })
            .catch(function (error) {
                $log.debug('Error searching:', error);
            });
        }

        function onSearchButtonClicked() {
            search(ctl.searchText, null, {
                bbox: searchBBox
            });
        }
    }

    angular.module('gw.views.home')
    .controller('HomeController', HomeController);

})();