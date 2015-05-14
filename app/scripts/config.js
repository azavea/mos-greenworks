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
        }
    };

    angular.module('gw.config', [])
    .constant('Config', config);

})();
