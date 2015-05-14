
(function () {
    'use strict';

    function TourConfig () {

        var config = {
            home: {
                title: 'About Greenworks',
                details: 'This year’s Greenworks Progress Report reflects the culmination of six years of work ' +
                         'toward the energy, environment, equity, economy, and engagement targets established ' +
                         'in the initial 2009 plan. With the leadership and support of City staff, ' +
                         'community partners, and elected officials, Philadelphia has seen gains in all ' +
                         'of the Greenworks focus areas.',
                buttonTitle: 'Home',
                css: 'mode-home',
                previous: null,
                next: 'energy'
            },
            energy: {
                title: 'Energy',
                details: 'City government energy usage rose in 2013 for the first time since 2007. As ' +
                         'shown in the chart on the facing page, energy usage rises and falls with changes in weather.',
                css: 'mode-energy',
                previous: 'home',
                next: 'environment'
            },
            environment: {
                title: 'Environment',
                details: 'City government energy usage rose in 2013 for the first time since 2007. ' +
                         'As shown in the chart on the facing page, energy usage rises and falls ' +
                         'with changes in weather.',
                css: 'mode-environment',
                previous: 'energy',
                next: 'equity',
            },
            equity: {
                title: 'Equity',
                details: 'City government energy usage rose in 2013 for the first time since 2007. As ' +
                         'shown in the chart on the facing page, energy usage rises and falls with changes in weather.',
                css: 'mode-equity',
                previous: 'environment',
                next: 'economy'
            },
            economy: {
                title: 'Economy',
                details: 'City government energy usage rose in 2013 for the first time since 2007. As ' +
                         'shown in the chart on the facing page, energy usage rises and falls with changes in weather.',
                css: 'mode-economy',
                previous: 'equity',
                next: 'engagement'
            },
            engagement: {
                title: 'Engagement',
                details: 'City government energy usage rose in 2013 for the first time since 2007. As ' +
                         'shown in the chart on the facing page, energy usage rises and falls with changes in weather.',
                css: 'mode-engagement',
                previous: 'economy',
                next: 'explore'
            },
            explore: {
                title: 'Explore',
                details: '',
                css: 'mode-explore',
                previous: 'engagement',
                next: null
            }
        };

        var module = {
            get: get
        };
        return module;

        function get(configKey) {
            return config[configKey] ? config[configKey] : config['home'];
        }
    }

    angular.module('gw.views.tour')
    .factory('TourConfig', TourConfig);

})();
