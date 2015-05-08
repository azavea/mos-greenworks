(function () {
    'use strict';

    /* ngInject */
    function DefaultRoutingConfig($locationProvider, $urlRouterProvider, Config) {

        $locationProvider.html5Mode(Config.html5Mode.enabled);
        $locationProvider.hashPrefix(Config.html5Mode.prefix);

        $urlRouterProvider.otherwise('/');
    }

    /* ngInject */
    function LogConfig($logProvider, Config) {
        $logProvider.debugEnabled(Config.debug);
    }

    /**
     * @ngdoc overview
     * @name mosGreenworksApp
     * @description
     * # gw
     *
     * Main module of the application.
     */
    angular.module('gw', [
        'gw.config',
        'gw.views.home'
    ])
    .config(DefaultRoutingConfig)
    .config(LogConfig);
})();
