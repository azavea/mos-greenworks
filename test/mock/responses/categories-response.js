
(function () {
    'use strict';

    var CategoriesResponse = {
        "rows": [
        {
          "count": 10,
          "section": "Economy",
          "project_category": "Bicycle and Pedestrian Infrastructure",
          "sub_category": "Bicycle Infrastructure"
        },
        {
          "count": 4063,
          "section": "Economy",
          "project_category": "Bicycle and Pedestrian Infrastructure",
          "sub_category": "Bike Lanes"
        },
        {
          "count": 71,
          "section": "Economy",
          "project_category": "Bicycle and Pedestrian Infrastructure",
          "sub_category": "IndeGo Stations"
        },
        {
          "count": 16,
          "section": "Economy",
          "project_category": "Bicycle and Pedestrian Infrastructure",
          "sub_category": "Pedestrian Space"
        },
        {
          "count": 2,
          "section": "Economy",
          "project_category": "Climate Resilience",
          "sub_category": "SEPTA Climate Resilience"
        },
        {
          "count": 6,
          "section": "Energy",
          "project_category": "Energy Efficiency in City-Owned Buildings",
          "sub_category": "City LEED buildings"
        },
        {
          "count": 20,
          "section": "Energy",
          "project_category": "Energy Efficiency in City-Owned Buildings",
          "sub_category": "Energy Efficiency Projects in City-Owned Buildings"
        },
        {
          "count": 4,
          "section": "Energy",
          "project_category": "Energy Efficiency in City-Owned Buildings",
          "sub_category": "Guaranteed Energy Savings Project"
        },
        {
          "count": 43,
          "section": "Energy",
          "project_category": "Energy Efficiency in Privately Owned Buildings",
          "sub_category": "Greenworks Small Business Loans"
        },
        {
          "count": 9,
          "section": "Energy",
          "project_category": "Energy Efficiency in Privately Owned Buildings",
          "sub_category": "SEPTA Energy Management"
        },
        {
          "count": 1,
          "section": "Engagement",
          "project_category": "Community Composting Sites",
          "sub_category": "Community Composting Sites"
        },
        {
          "count": 10,
          "section": "Environment",
          "project_category": "Air Monitoring Stations",
          "sub_category": "Air Monitoring Stations"
        },
        {
          "count": 51,
          "section": "Environment",
          "project_category": "Alternative Vehicle Fuel Infrastructure",
          "sub_category": "Alternative Energy Vehicle Fueling Stations"
        },
        {
          "count": 6,
          "section": "Environment",
          "project_category": "Alternative Vehicle Fuel Infrastructure",
          "sub_category": "SEPTA Hybrid Bus Depots"
        },
        {
          "count": 1,
          "section": "Equity",
          "project_category": "Access to Healthy Food",
          "sub_category": "Commercial Kitchen Center"
        },
        {
          "count": 66,
          "section": "Equity",
          "project_category": "Access to Healthy Food",
          "sub_category": "Farmers' Markets"
        },
        {
          "count": 4,
          "section": "Equity",
          "project_category": "Access to Healthy Food",
          "sub_category": "Food Co-op"
        },
        {
          "count": 3,
          "section": "Equity",
          "project_category": "Access to Healthy Food",
          "sub_category": "New Supermarket"
        },
        {
          "count": 1,
          "section": "Equity",
          "project_category": "Access to Healthy Food",
          "sub_category": "Philadelphia Prison Orchard Project"
        },
        {
          "count": 1,
          "section": "Equity",
          "project_category": "Access to Healthy Food",
          "sub_category": "Public Food Market"
        },
        {
          "count": 292,
          "section": "Equity",
          "project_category": "Green Stormwater Infrastructure",
          "sub_category": "Green Stormwater Infrastructure"
        },
        {
          "count": 13795,
          "section": "Equity",
          "project_category": "New Trees",
          "sub_category": "New Street Trees"
        },
        {
          "count": 1524,
          "section": "Equity",
          "project_category": "New Trees",
          "sub_category": "New Yard Trees"
        }
        ],
        "time": 0.146,
        "fields": {
        "count": {
          "type": "number"
        },
        "section": {
          "type": "string"
        },
        "project_category": {
          "type": "string"
        },
        "sub_category": {
          "type": "string"
        }
        },
        "total_rows": 23
    };

angular.module('mock.responses')
    .constant('CategoriesResponse', CategoriesResponse);
})();
