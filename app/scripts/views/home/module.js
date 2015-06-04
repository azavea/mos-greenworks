(function() {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'scripts/views/home/home-partial.html',
            controller: 'HomeController',
            controllerAs: 'home'
        });
    }

    angular.module('gw.views.home', [
        'ui.router',
        'ui.bootstrap'
    ])
    .config(StateConfig);
})();