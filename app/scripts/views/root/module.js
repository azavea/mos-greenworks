(function() {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('root', {
            abstract: true,
            url: '',
            templateUrl: 'scripts/views/root/root-partial.html',
            controller: 'RootController',
            controllerAs: 'root'
        });
    }

    angular.module('gw.views.root', [
        'ui.router',
        'ui.bootstrap',
        'gw.geocoder'
    ])
    .config(StateConfig);
})();