(function() {
    'use strict';

    /**
     * Configuration for gw app
     * @type {Object}
     */
    var config = {
        debug: false,
        html5Mode: {
            enabled: false,
            prefix: ''
        },
        // Visualization reference IDs used by vis-service
        ids: {
            tour: 'tour',
            map: 'map'
        },
        bikeLaneKey: 'Bike Lane',
        bikeTrailKey: 'Trail',
        cartodb: {
            user: 'greenworks',
            table: 'database_final',
            layerId: 1,
            layers: {
                categories: 3,
                bikeLanes: 1,
                bikeTrails: 0
            }
        },
        search: {
            zoom: {
                address: 17,
                neighborhood: 15
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
