(function() {
    'use strict';

    /**
     * Controller for the gw app tour sidebar page view
     */
    /* ngInject */
    function TourPageController($log, $compile, $scope, $state, $stateParams, $timeout,
                                Config, TourConfig, TourPopupConfig, Visualization) {

        var vis = null;
        var popupContent = '' +
            '<div ng-class="tour.pageConfig.css">' +
              '<div class="popup-left">' +
                '<div class="popup-image" ng-style="{ \'background-image\': \'url(\' + tour.popupInfo.image + \')\' }">' +
                '</div>' +
              '</div>' +
              '<div class="popup-right">' +
                '<h4 class="popup-header mode-background">{{ ::tour.popupInfo.title }}</h4>' +
                '<div class="popup-body">' +
                  '<h5 class="popup-heading mode-color">Address</h5>' +
                  '<div class="h5">{{ ::tour.popupInfo.address }}</div>' +
                  '<h5 class="popup-heading mode-color">Target</h5>' +
                  '<div class="h5">{{ ::tour.popupInfo.target }}</div>' +
                  '<h5 class="popup-heading mode-color">Description</h5>' +
                  '<div class="h5">{{ ::tour.popupInfo.description }}</div>' +
                '</div>' +
             '</div>' +
            '</div>';
        var popup = null;

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

            // Always clear the popup when we leave this view
            $scope.$on('$destroy', function () {
                if (popup) {
                  vis.getNativeMap().closePopup(popup);
                }
            })
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
            showInfoPopup(vis.getNativeMap());
        }

        function onVisError(error) {
            $log.error(error);
        }

        function showInfoPopup(map) {
            ctl.popupInfo = TourPopupConfig.get(ctl.page);
            var content = $compile(popupContent)($scope);
            popup = L.popup({ minWidth: 600 })
                .setLatLng(ctl.popupInfo.point)
                .setContent(content[0]);
            $timeout(function () {
                map.openPopup(popup);
            })
        }
    }

    angular.module('gw.views.tour')
    .controller('TourPageController', TourPageController);

})();
