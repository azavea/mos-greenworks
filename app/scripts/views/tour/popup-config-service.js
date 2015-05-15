(function () {
    'use strict';

    function TourPopupConfig () {

        var config = {
            energy: {
                title: 'City LEED Buildings',
                address: '4750 Grays Ferry Avenue',
                target: 'Target 1 Lower City Government Energy Consumption by 30 Percent.',
                description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam euismod tincidunt.',
                image: 'http://placehold.it/350x150',
                point: {
                    lat: 39.972743,
                    lng: -75.123081
                }
            }
        };

        var module = {
            get: get
        };
        return module;

        /**
         * Get config for each tour step's infowindow popup
         *
         * TODO: Does this come from a cartodb.SQL call instead?
         *
         * @param  {string} configKey Key in config object
         * @return {object}
         */
        function get(configKey) {
            return config[configKey] ? config[configKey] : config.energy;
        }
    }

    angular.module('gw.views.tour')
    .factory('TourPopupConfig', TourPopupConfig);

})();
