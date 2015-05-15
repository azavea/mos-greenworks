
(function () {
    'use strict';

    /**
     * Configuration objects for the tour pages:
     *
     * title: string        -- Title to display in sidebar header
     * section: string      -- Filter value used in sql WHERE clause when filtering map by section
     *                         Optional. If not provided or falsy, no map filtering done
     * details: string      -- Descriptive text to display in the sidebar header
     * buttonTitle: string  -- Text to display on nav buttons at the bottom of the sidebar
     *                         Optional. If not provided, falls back to using title
     * css: string          -- The css class used to properly color page elements.
     *                         Must be one of the options defined in: styles/base/_mode-colors.scss
     * previous: string     -- Key to another object in this config, used to indicate which is
     *                         the previous view in the tour. Null if the first view.
     * next: string         -- Key to another object in this config, used to indicate which is
     *                         the next view in the tour. Null if the last view.
     */
    function TourConfig () {

        var config = {
            home: {
                title: 'About Greenworks',
                section: null,
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
                section: 'Energy',
                details: 'City government energy usage rose in 2013 for the first time since 2007. As ' +
                         'shown in the chart on the facing page, energy usage rises and falls with changes in weather.',
                css: 'mode-energy',
                previous: 'home',
                next: 'environment'
            },
            environment: {
                title: 'Environment',
                section: 'Environment',
                details: 'City government energy usage rose in 2013 for the first time since 2007. ' +
                         'As shown in the chart on the facing page, energy usage rises and falls ' +
                         'with changes in weather.',
                css: 'mode-environment',
                previous: 'energy',
                next: 'equity',
            },
            equity: {
                title: 'Equity',
                section: 'Equity',
                details: 'City government energy usage rose in 2013 for the first time since 2007. As ' +
                         'shown in the chart on the facing page, energy usage rises and falls with changes in weather.',
                css: 'mode-equity',
                previous: 'environment',
                next: 'economy'
            },
            economy: {
                title: 'Economy',
                section: 'Economy',
                details: 'City government energy usage rose in 2013 for the first time since 2007. As ' +
                         'shown in the chart on the facing page, energy usage rises and falls with changes in weather.',
                css: 'mode-economy',
                previous: 'equity',
                next: 'engagement'
            },
            engagement: {
                title: 'Engagement',
                section: 'Engagement',
                details: 'City government energy usage rose in 2013 for the first time since 2007. As ' +
                         'shown in the chart on the facing page, energy usage rises and falls with changes in weather.',
                css: 'mode-engagement',
                previous: 'economy',
                next: 'explore'
            },
            explore: {
                title: 'Explore',
                section: null,
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
            return config[configKey] ? config[configKey] : config.home;
        }
    }

    angular.module('gw.views.tour')
    .factory('TourConfig', TourConfig);

})();
