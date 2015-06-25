(function() {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('map', {
            url: '/map?lat&lng&zoom',
            templateUrl: 'scripts/views/map/map-partial.html',
            controller: 'MapController',
            controllerAs: 'map'
        });
    }

    angular.module('gw.views.map', [
        'ui.router',
        'ui.bootstrap',
        'cartodb',
        'gw.config',
        'gw.views.search'
    ])
    .config(StateConfig);
})();
