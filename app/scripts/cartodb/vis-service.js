(function() {
    'use strict';

    /* ngInject */
    function Visualization($q) {
        var visualizations = {};

        var module = {
            add: add,
            get: get,
            remove: remove
        };
        return module;

        function add(visId, vis) {
            visualizations[visId] = vis;
        }

        /**
         * Get a cartodb visualization saved with visId
         * @param  {string} visId Visualization ID to retrieve
         * @return {$q.deferred} Promise that resolves once visualization is ready.
         *                               First argument is vis
         *                               Second argument is layers
         *                               Same as cartodb.createVis
         */
        function get(visId) {
            var dfd = $q.defer();
            if (visualizations[visId]) {
                visualizations[visId].done(function (vis, layers) {
                    dfd.resolve(vis, layers);
                }, function (error) {
                    dfd.reject(error);
                });
            } else {
                dfd.reject('Visualization with id ' + visId + ' does not exist.');
            }

            return dfd.promise;
        }

        function remove(visId) {
            delete visualizations[visId];
        }
    }

    angular.module('cartodb')
    .factory('Visualization', Visualization);

})();
