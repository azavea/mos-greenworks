(function() {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('map', {
            url: '/map?bbox',
            templateUrl: 'scripts/views/map/map-partial.html',
            controller: 'MapController',
            controllerAs: 'map'
        });
    }

    angular.module('gw.views.map', [
        'ui.router',
        'ui.bootstrap',
        'cartodb',
        'gw.geocoder'
    ])
    .config(StateConfig);
})();
