
(function() {
    'use strict';

    /**
     * Controller for the gw app root view -- handles header bar and search bar logic
     */
    /* ngInject */
    function RootController($log) {

        var ctl = this;

        initialize();

        function initialize() {
            $log.debug('RootController.initialize()');
        }
    }

    angular.module('gw.views.root')
    .controller('RootController', RootController);
})();
