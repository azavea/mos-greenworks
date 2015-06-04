
(function () {
    'use strict';

    /* ngInject */
    function Affix($log, $window) {

        var module = {
            restrict: 'A',
            link: link
        };
        return module;

        function link(scope, element, attrs) {
            var originalTop = element.offset().top;
            var affixOffsetTop = attrs.affixOffsetTop ? parseInt(attrs.affixOffsetTop, 10) : 0;

            angular.element($window).bind('scroll', function() {
                var yPosition = window.pageYOffset;
                if (yPosition + affixOffsetTop >= originalTop) {
                    element.addClass('affix');
                } else {
                    element.removeClass('affix');
                }
            });
        }
    }

    angular.module('gw.affix')
    .directive('affix', Affix);

})();
