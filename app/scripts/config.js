(function() {
    'use strict';

    /**
     * Configuration for gw app
     * @type {Object}
     */
    var config = {
        debug: true,
        html5Mode: {
            enabled: false,
            prefix: '!'
        },
        // Visualization reference IDs used by vis-service
        ids: {
            tour: 'tour',
            map: 'map'
        },
        cartodb: {
            user: 'greenworks',
            layerId: 1,
            sublayerId: 2
        },
        bounds: {
            northEast: {
                lat: 40.148059,
                lng: -74.945342
            },
            southWest: {
                lat: 39.869314,
                lng: -75.291411
            }
        }
    };

    angular.module('gw.config', [])
    .constant('Config', config);

})();
