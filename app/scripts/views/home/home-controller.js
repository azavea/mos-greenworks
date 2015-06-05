
(function() {
    'use strict';

    /**
     * Controller for the gw app home view
     */
    /* ngInject */
    function HomeController(Sections) {

        var ctl = this;

        initialize();

        function initialize() {
            ctl.sections = Sections;
        }
    }

    angular.module('gw.views.home')
    .controller('HomeController', HomeController);

})();