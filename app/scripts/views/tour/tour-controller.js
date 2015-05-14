(function() {
    'use strict';

    /**
     * Controller for the gw app tour view
     */
    /* ngInject */
    function TourController() {
        var ctl = this;
        initialize();

        function initialize() {
            cartodb.createVis('map', 'http://greenworks.cartodb.com/api/v2/viz/33627780-f988-11e4-8ff7-0e0c41326911/viz.json');
        }
    }

    angular.module('gw.views.tour')
    .controller('TourController', TourController);

})();
