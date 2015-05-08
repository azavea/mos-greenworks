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
        }
    };

    angular.module('gw.config', [])
    .constant('Config', config);

})();
