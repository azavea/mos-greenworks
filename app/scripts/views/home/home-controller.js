(function() {
    'use strict';

    /**
     * Controller for the gw app home view
     */
    /* ngInject */
    function HomeController($log) {

        var ctl = this;

        initialize();

        function initialize() {
            $log.debug('HomeController.initialize()');
        }
    }

    angular.module('gw.views.home')
    .controller('HomeController', HomeController);

})();
