'use strict';

describe('gw.cartodb: SQLFilter', function () {

    beforeEach(module('cartodb'));

    var SQLFilter;
    var defaults = {
        tableName: 'foo_table',
        displayFields: ['abc', 'def'],
        where: {
            column: 'bar_column',
            list: ['bar1', 'bar2']
        }
    };
    var filter = null;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_SQLFilter_) {
        SQLFilter = _SQLFilter_;

    }));

    describe('tests for SQLFilter API', function () {

        describe('tests for SQLFilter constructor', function () {

            it('should create a valid sql query with no WHERE if no options provided', function () {
                filter = new SQLFilter();
                var query = filter.makeSql();
                expect(query).toMatch(/^SELECT/i);
                expect(query).toMatch(/FROM/i);
                expect(query).not.toMatch(/WHERE/i);
            });

            it('should properly set tableName in constructor', function () {
                filter = new SQLFilter(defaults);
                var query = filter.makeSql();
                expect(query).toMatch(defaults.tableName);
            });

            it('should properly set display fields in constructor', function () {
                filter = new SQLFilter(defaults);
                var query = filter.makeSql();
                angular.forEach(defaults.displayFields, function (field) {
                    expect(query).toMatch(field);
                });
            });

            it('should properly set where clause in constructor', function () {
                filter = new SQLFilter(defaults);
                var query = filter.makeSql();
                expect(query).toMatch(defaults.where.column);
                expect(query).toMatch('IN');
                angular.forEach(defaults.where.list, function (field) {
                    expect(query).toMatch(field);
                });
            });

        });

        describe('tests for makeSql', function () {

            beforeEach(inject(function () {
                filter = new SQLFilter(defaults);
            }));

            it('should allow makeSql to override default tableName', function () {
                var newTableName = 'bar_table';
                var query = filter.makeSql({
                    tableName: newTableName
                });
                expect(query).toMatch(newTableName);
            });

            it('should ensure a query does not end with ;', function () {
                // Because cartodb setSql will fail with a semicolon at the end
                var query = filter.makeSql();
                expect(query.trim()).not.toMatch(/;$/);
            });

            it('should ensure that values in where list are properly escaped', function () {
                var query = filter.makeSql({
                    where: {
                        column: 'foobar',
                        list: [null, 'abc', 'de\'f', 1, 2, undefined]
                    }
                });

                // include strings, escaped
                expect(query).toMatch(/'abc'/);
                expect(query).toMatch(/'de''f'/);

                // Do not include null/undefined values in where clause
                expect(query).not.toMatch(/null/);
                expect(query).not.toMatch(/undefined/);

                // include numbers, but do not string escape them
                expect(query).toMatch(/1/);
                expect(query).toMatch(/2/);
                expect(query).not.toMatch(/['"]1['"]/);
                expect(query).not.toMatch(/['"]2['"]/);
            });
        });

        describe('tests for setDisplayFields', function () {
            var newFields = ['123', '456'];
            beforeEach(inject(function () {
                filter = new SQLFilter(defaults);
            }));

            it('should update display fields when array is passed', function () {
                filter.setDisplayFields(newFields);
                var query = filter.makeSql();
                angular.forEach(newFields, function (field) {
                    expect(query).toMatch(field);
                });
            });

            it('should revert display fields to "*" when null is passed', function () {
                filter.setDisplayFields(null);
                var query = filter.makeSql();
                expect(query).toMatch(/SELECT \* FROM/i);
            });
        });

        describe('tests for setWhere', function () {
            var newList = ['123', '456'];
            var newColumn = 'new_column';

            beforeEach(inject(function () {
                filter = new SQLFilter(defaults);
            }));

            it('should update column property only if string', function () {
                filter.setWhere({
                    column: null
                });
                expect(filter.makeSql()).toMatch(defaults.where.column);

                filter.setWhere({
                    column: newColumn
                });
                expect(filter.makeSql()).toMatch(newColumn);
            });

            it('should revert to no WHERE if where.list === null', function () {
                expect(filter.makeSql()).toMatch(/WHERE/i);
                filter.setWhere({
                    list: null
                });
                expect(filter.makeSql()).not.toMatch(/WHERE/i);
            });

            it('should update WHERE values if list updated', function () {
                filter.setWhere({
                    list: newList
                });
                angular.forEach(newList, function (value) {
                    expect(filter.makeSql()).toMatch(value);
                });
            });

            it('should allow an empty list', function () {
                filter.setWhere({
                    list: []
                });
                expect(filter.makeSql()).toMatch(/IN \('DOESNOTEXIST'\)/i);
            });
        });
    });
});