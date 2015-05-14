(function() {
    'use strict';

    /* ngInject */
    function Visualization($log, $q) {
        var visualizations = {};

        var module = {
            add: add,
            get: get,
            remove: remove
        };
        return module;

        /**
         * Cache a visualization for retrieval later with get()
         * @param {string} visId Visualization ID to use in later calls to get/delete
         * @param {object} vis   The result object from calling cartodb.createVis
         */
        function add(visId, vis) {
            visualizations[visId] = vis;
        }

        /**
         * Get a cartodb visualization saved with visId
         * @param  {string} visId Visualization ID to retrieve
         * @return {$q.deferred} Promise that resolves once visualization is ready.
         *                       The parameters passed to the promise callback are the same
         *                       as cartodb.createVis().done():
         *                           First argument is vis
         *                           Second argument is layers
         *                       If promise is rejected, only argument is an error string
         */
        function get(visId) {
            var dfd = $q.defer();
            if (visualizations[visId]) {
                try {
                    var layers = visualizations[visId].getLayers();
                    dfd.resolve(visualizations[visId], layers);
                // If we don't have layers yet, catch the exception and wait for
                // layers to be ready
                } catch (e) {
                    // This is our expected error if layers is not initialized
                    // Catch it and wait for layers to be ready, then resolve
                    // otherwise let the error fall through to reject
                    // This may need to be changed on upgrades to cartodbjs
                    if (e instanceof TypeError && e.message.indexOf('Cannot read property') !== -1) {
                        visualizations[visId].done(function (vis, layers) {
                            dfd.resolve(vis, layers);
                        }, function (error) {
                            dfd.reject(error);
                        });
                    } else {
                        dfd.reject(e.message);
                    }
                }
            } else {
                dfd.reject('Visualization with id ' + visId + ' does not exist.');
            }

            return dfd.promise;
        }

        /**
         * Remove a vis from our cache
         *
         * There is no delete/cleanup/remove method on the cartodbjs API, so we can't really
         * do anything other than this
         *
         * @param  {string} visId Visualization ID to delete
         */
        function remove(visId) {
            delete visualizations[visId];
        }
    }

    angular.module('cartodb')
    .factory('Visualization', Visualization);

})();
