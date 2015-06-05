
(function () {
    'use strict';

    /* ngInject */
    function LocationSearchController($log, $scope, Config, Geocoder) {

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

            ctl.clearError = clearError;
            ctl.onSearchButtonClicked = onSearchButtonClicked;
        }

        function search(searchText, magicKey, options) {
            Geocoder.search(searchText, magicKey, options)
            .then(function (results) {
                if (results && results.length) {
                    var result = results[0];
                    var latLng = L.latLng(result.feature.geometry.y, result.feature.geometry.x);
                    if (searchBounds.contains(latLng)) {
                        // TODO: Determine if neighborhood or address result and properly
                        // set zoom parameter
                        $scope.onResultFound()(latLng, Config.search.zoom.address);
                    } else {
                        showError('No results near Philadelphia');
                    }
                } else {
                    showError('No results');
                }
            })
            .catch(function (error) {
                showError(error);
            });
        }

        function showError(msg) {
            ctl.error = msg;
            var errorFunction = $scope.onResultError();
            if (errorFunction) {
                errorFunction(msg);
            }
            $log.debug(msg);
        }

        function clearError() {
            ctl.error = null;
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
