(function() {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('map', {
            parent: 'root',
            url: '/map?bbox',
            templateUrl: 'scripts/views/map/map-partial.html',
            controller: 'MapController',
            controllerAs: 'map'
        });
    }

    angular.module('gw.views.map', [
        'ui.router',
        'ui.bootstrap'
    ])
    .config(StateConfig);
})();
