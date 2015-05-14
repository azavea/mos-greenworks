(function() {
    'use strict';

    /**
     * Controller for the gw app tour sidebar page view
     */
    /* ngInject */
    function TourPageController($log, $scope, $state, $stateParams, Config, TourConfig, Visualization) {

        var vis = null;
        var popupContent = '' +
            '<div class="popup-left">' +
               '<div class="popup-image" style="background-image: url(http://placehold.it/350x150)">' +
               '</div>' +
           '</div>' +
           '<div class="popup-right">' +
               '<h4 class="popup-header mode-background">City LEED Buildings</h4>' +
               '<div class="popup-body">' +
                   '<h5 class="popup-heading mode-color">Address</h5>' +
                   '<div class="h5">4750 Grays Ferry Avenue</div>' +
                   '<h5 class="popup-heading mode-color">Target</h5>' +
                   '<div class="h5">Target 1 Lower City Government Energy Consumption by 30 Percent.</div>' +
                   '<h5 class="popup-heading mode-color">Description</h5>' +
                   '<div class="h5">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam euismod tincidunt.</div>' +
               '</div>' +
           '</div>';

        var ctl = this;
        initialize();

        function initialize() {
            ctl.page = $stateParams.page;
            ctl.pageConfig = TourConfig.get(ctl.page);
            ctl.prevConfig = TourConfig.get(ctl.pageConfig.previous);
            ctl.nextConfig = TourConfig.get(ctl.pageConfig.next);

            ctl.sidebarPartial = '/scripts/views/tour/sidebars/' + ctl.page + '-partial.html';
            ctl.pageLogo = '/images/' + ctl.page + '-logo.png';
            ctl.prevButtonTitle = !ctl.pageConfig.previous ? 'Skip the tour' :
                                  ctl.prevConfig.buttonTitle || ctl.prevConfig.title;
            ctl.nextButtonTitle = !ctl.pageConfig.next ? 'Explore' :
                                  ctl.nextConfig.buttonTitle || ctl.nextConfig.title;

            ctl.onPrevClick = onPrevClick;
            ctl.onNextClick = onNextClick;

            Visualization.get(Config.ids.tour).then(onVisReady, onVisError);
        }

        function onPrevClick() {
            if (!ctl.pageConfig.previous) {
                $state.go('map');
            } else {
                $state.go('tour.page', { page: ctl.pageConfig.previous });
            }
        }

        function onNextClick() {
            if (!ctl.pageConfig.next) {
                $state.go('map');
            } else {
                $state.go('tour.page', { page: ctl.pageConfig.next });
            }
        }

        function onVisReady(newVis, layers) {
            vis = newVis;
            $log.debug(vis);
        }

        function onVisError(error) {
            $log.error(error);
        }
    }

    angular.module('gw.views.tour')
    .controller('TourPageController', TourPageController);

})();
