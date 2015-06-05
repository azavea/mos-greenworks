
(function () {
    'use strict';

    /* ngInject */
    function LocationSearchController($log, $state, Config, Geocoder) {

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
        }

        function search(searchText, magicKey, options) {
            Geocoder.search(searchText, magicKey, options)
            .then(function (results) {
                if (results && results.length) {
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

    /* ngInject */
    function LocationSearch() {

        var module = {
            restrict: 'E',
            templateUrl: '/scripts/views/search/location-search-partial.html',
            replace: true,
            scope: {
                onResultFound: '&',
                onResultError: '&',
            },
            controller: 'LocationSearchController',
            controllerAs: 'search'
        };
        return module;

    }

    angular.module('gw.views.search')
    .controller('LocationSearchController', LocationSearchController)
    .directive('locationSearch', LocationSearch);

})();
