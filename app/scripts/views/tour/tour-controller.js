(function() {
    'use strict';

    /**
     * Controller for the gw app tour view
     */
    /* ngInject */
    function TourController($log, $scope, Config, Visualization) {
        var ctl = this;
        initialize();

        function initialize() {
            var vis = cartodb.createVis('map', 'http://greenworks.cartodb.com/api/v2/viz/33627780-f988-11e4-8ff7-0e0c41326911/viz.json');
            Visualization.add(Config.ids.tour, vis);

            // Delete vis on scope destroy to free resources
            // and allow for it to be created again later
            $scope.$on('$destroy', function () {
                Visualization.remove(Config.ids.tour);
            });
        }
    }

    angular.module('gw.views.tour')
    .controller('TourController', TourController);

})();
