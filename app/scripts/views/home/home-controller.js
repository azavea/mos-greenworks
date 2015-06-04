
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
        }
    }

    angular.module('gw.views.home')
    .controller('HomeController', HomeController);

})();