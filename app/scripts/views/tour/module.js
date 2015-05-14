(function() {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('tour', {
            parent: 'root',
            abstract: true,
            url: '/tour',
            templateUrl: 'scripts/views/tour/tour-partial.html',
            controller: 'TourController',
            controllerAs: 't'
        });
        $stateProvider.state('tour.page', {
            url: '/:page',
            templateUrl: 'scripts/views/tour/tour-page-partial.html',
            controller: 'TourPageController',
            controllerAs: 'tour'
        });
    }

    angular.module('gw.views.tour', [
        'ui.router'
    ])
    .config(StateConfig);
})();
