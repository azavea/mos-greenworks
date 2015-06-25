
'use strict';

describe('gw.cartodb: Categories', function () {

    beforeEach(module('cartodb'));
    beforeEach(module('mock.responses'));

    var $httpBackend;
    var $q;
    var $rootScope;
    var Categories;
    var CategoriesResponse;
    var categoriesTree;
    var sql = null;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$httpBackend_, _$q_, _$rootScope_, _Categories_, _CategoriesResponse_) {
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        Categories = _Categories_;
        CategoriesResponse = _CategoriesResponse_;

        // Mock out a synchronous version of (new cartodb.SQL()).execute()
        sql = {
            execute: function () {
                return {
                    done: function (fn) {
                        fn(CategoriesResponse);
                        return {
                            error: function () {}
                        };
                    }
                };
            }
        };

        Categories.get(sql).then(function (tree) {
            categoriesTree = tree;
        });
        $rootScope.$apply();
    }));

    describe('Tests for Categories', function () {
        it('should get the category list via the sql api, with 5 top level categories', function () {
            expect(categoriesTree).toEqual(jasmine.any(Object));
            expect(_.keys(categoriesTree).length).toEqual(5);
        });

        it('should properly return a parent key for a subcategory', function () {
            var subKey = 'City LEED buildings';
            var parentKey = 'Energy Efficiency in City-Owned Buildings';

            expect(Categories.getSubcategoryParentKey(subKey)).toEqual(parentKey);

            // return null for key not found
            expect(Categories.getSubcategoryParentKey('DOESNOTEXIST')).toBe(null);
        });

        it('should properly return all second level keys', function () {
            var projectKeys = {
                'Bicycle and Pedestrian Infrastructure': true,
                'Climate Resilience': true,
                'Energy Efficiency in City-Owned Buildings': true,
                'Energy Efficiency in Privately Owned Buildings': true,
                'Community Composting Sites': true,
                'Air Monitoring Stations': true,
                'Alternative Vehicle Fuel Infrastructure': true,
                'Access to Healthy Food': true,
                'Green Stormwater Infrastructure': true,
                'New Trees': true
            };
            expect(Categories.allProjectKeys()).toEqual(projectKeys);
        });

        it('should return all bottom level keys', function () {
            expect(_.keys(Categories.allSubKeys()).length).toEqual(25);
            // TODO: Check the actual key values?
        });

        it('should return all sub keys for a given category as an array', function () {
            var keysOne = ['New Street Trees', 'New Yard Trees'];
            expect(Categories.getKeysForCategory(categoriesTree, 'New Trees')).toEqual(keysOne);

            // Also should work at any level
            var keysTwo = ['Access to Healthy Food', 'Green Stormwater Infrastructure', 'New Trees', 'Bicycle and Pedestrian Infrastructure'];
            expect(Categories.getKeysForCategory(categoriesTree, 'Equity')).toEqual(keysTwo);
        });

        it('should ensure that a bad key for icons returns null', function () {
            expect(Categories.getIcon('IMA BAD KEY')).toBe(null);
        });
    });
});
