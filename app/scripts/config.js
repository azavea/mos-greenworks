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
            layers: {
                categories: 2,
                bikeLanes: 1,
                bikeTrails: 0
            }
        },
        search: {
            zoom: {
                address: 17,
                neighborhood: 9
            }
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
