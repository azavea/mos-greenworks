
describe('gw.geocoder: Geocoder', function () {
    'use strict';

    beforeEach(module('gw.geocoder'));
    beforeEach(module('mock.responses'));

    var $httpBackend;
    var $rootScope;
    var Geocoder;
    var FindResponse;
    var SuggestResponse;

    var findUrl = /\/arcgis\/rest\/services\/World\/GeocodeServer\/find\?.*/;
    var suggestUrl = /\/arcgis\/rest\/services\/World\/GeocodeServer\/suggest\?.*/;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, _$rootScope_, _Geocoder_, _FindResponse_, _SuggestResponse_) {
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        Geocoder = _Geocoder_;
        FindResponse = _FindResponse_;
        SuggestResponse = _SuggestResponse_;
    }));

    describe('suggest() tests', function () {
        it('should remove all results with isCollection: true', function () {
            $httpBackend.whenGET(suggestUrl).respond(SuggestResponse);
            expect(SuggestResponse.suggestions.length).toEqual(3);
            Geocoder.suggest('one').then(function (response) {
                expect(response.length).toEqual(2);
            });
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('find() tests', function () {
        it('should resolve with an array of locations', function () {
            $httpBackend.whenGET(findUrl).respond(FindResponse);
            Geocoder.search('one').then(function (response) {
                expect(response.length).toEqual(2);
            });
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});
