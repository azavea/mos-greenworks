(function() {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('map', {
            parent: 'root',
            url: '/map',
            templateUrl: 'scripts/views/map/map-partial.html',
            controller: 'MapController',
            controllerAs: 'map'
        });
    }

    angular.module('gw.views.map', [
        'ui.router'
    ])
    .config(StateConfig);
})();
