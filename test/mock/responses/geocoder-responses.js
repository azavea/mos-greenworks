
(function () {
    'use strict';

    var SuggestResponse = {
        suggestions: [{
            text: 'one',
            magicKey: 'one',
            isCollection: false
        }, {
            text: 'two',
            magicKey: 'two',
            isCollection: false
        }, {
            text: 'three',
            magicKey: 'three',
            isCollection: true
        }]
    };

    var FindResponse = {
        locations: [{
            feature: {
                attributes: {
                    city: 'New York'
                },
                geometry: {
                    x: 100.0,
                    y: 200.0
                }
            }
        }, {
            feature: {
                attributes: {
                    city: 'Philadelphia'
                },
                geometry: {
                    x: 100.0,
                    y: 200.0
                }
            }
        }]
    };

    angular.module('mock.responses')
        .constant('SuggestResponse', SuggestResponse)
        .constant('FindResponse', FindResponse);
})();