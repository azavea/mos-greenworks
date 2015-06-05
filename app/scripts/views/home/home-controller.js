
(function() {
    'use strict';

    /**
     * Controller for the gw app home view
     */
    /* ngInject */
    function HomeController($state, Sections) {

        var ctl = this;

        initialize();

        function initialize() {
            ctl.sections = Sections;

            ctl.onSearchResult = onSearchResult;
        }

        function onSearchResult(center, zoom) {
            $state.go('map', {
                lat: center.lat,
                lng: center.lng,
                zoom: zoom
            });
        }
    }

    angular.module('gw.views.home')
    .controller('HomeController', HomeController);

})();