
(function () {
    'use strict';

    var Sections = [
        {
            key: 'energy',
            cssClass: 'mode-energy',
            title: 'Energy'
        },
        {
            key: 'environment',
            cssClass: 'mode-environment',
            title: 'Environment'
        },
        {
            key: 'equity',
            cssClass: 'mode-equity',
            title: 'Equity'
        },
        {
            key: 'economy',
            cssClass: 'mode-economy',
            title: 'Economy'
        },
        {
            key: 'engagement',
            cssClass: 'mode-engagement',
            title: 'Engagement'
        }
    ];

    angular.module('gw.views.home')
    .constant('Sections', Sections);

})();
