
(function () {
    'use strict';

    /* ngInject */
    function LocationSearchController($log, $q, $scope, Config, Geocoder) {

        var searchBBox = [
            Config.bounds.southWest.lng,
            Config.bounds.southWest.lat,
            Config.bounds.northEast.lng,
            Config.bounds.northEast.lat
        ].join(',');
        var searchBounds = L.latLngBounds(Config.bounds.southWest, Config.bounds.northEast);
        var searching = false;
        var sql = new cartodb.SQL({ user: Config.cartodb.user });
        var ctl = this;

        initialize();

        function initialize() {
            ctl.searchText = '';
            ctl.suggest = suggest;
            ctl.search = search;

            ctl.clearError = clearError;
            ctl.onSearchButtonClicked = onSearchButtonClicked;
            ctl.onTextKeyup = onTextKeyup;
        }

        function suggest(suggestText) {
            var dfd = $q.defer();
            $q.all([
                Geocoder.suggest(suggestText),
                neighborhoodSuggest(suggestText)
            ]).then(function (results) {
                var addresses = results[0];
                var neighborhoods = results[1];
                dfd.resolve(neighborhoods.concat(addresses));
            }).catch(function (error) {
                dfd.reject(error);
            });
            return dfd.promise;
        }

        function search(result, options) {
            // Handles the case where use hits enter on selected typehaead entry
            // When that happens, both ng-keyup and typeahead-on-select call this function
            // If this leads to weird behaviour, consider replacing with _.debouce or _.throttle
            if (searching) {
                return;
            }

            $log.debug(result);
            // Address result
            if (result.magicKey !== undefined) {
                searching = true;
                Geocoder.search(result.text, result.magicKey, options)
                .then(function (results) {
                    if (results && results.length) {
                        var result = results[0];
                        var latLng = L.latLng(result.feature.geometry.y, result.feature.geometry.x);
                        if (searchBounds.contains(latLng)) {
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
                }).finally(function () {
                    searching = false;
                });
            // Neighborhood result
            } else if (result.centroid) {
                var centroid = angular.fromJson(result.centroid);
                var latLng = L.latLng(centroid.coordinates[1], centroid.coordinates[0]);
                $scope.onResultFound()(latLng, Config.search.zoom.neighborhood);
            } else {
                showError('Invalid result type');
            }
        }

        function neighborhoodSuggest(suggestText) {
            // Wrap in angular promise for promise API consistency
            var dfd = $q.defer();
            var query = 'SELECT listname as text, ST_AsGeoJSON(ST_Centroid(the_geom)) as centroid ' +
                        'FROM neighborhoods_philadelphia WHERE listname ILIKE \'%:suggestText%\' ' +
                        'ORDER BY listname';
            query = query.replace(':suggestText', suggestText);
            $log.debug(query);
            sql.execute(query).done(function (data) {
                dfd.resolve(data.rows);
            }).error(function (error) {
                dfd.reject(error);
            });
            return dfd.promise;
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
            search({ text: ctl.searchText, magicKey: null}, {
                bbox: searchBBox
            });
        }

        function onTextKeyup(event) {
            if (event.keyCode === 13) { // enter
                search({ text: ctl.searchText, magicKey: null}, {
                    bbox: searchBBox
                });
            }
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
