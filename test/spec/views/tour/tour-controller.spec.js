'use strict';

describe('gw.views.tour: TourController', function () {

    beforeEach(module('gw.views.tour'));

    var TourController;
    var rootScope;
    var scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($rootScope) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
    }));

    describe('tests for tour controller', function () {
        beforeEach(inject(function ($controller) {
            TourController = $controller('TourController', {
                $scope: scope
            });
        }));

        it('should be a dummy test', function () {
            expect(true).toEqual(true);
        });
    });
});
