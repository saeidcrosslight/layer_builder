/**
 * Created by Saeid Sadeh on 11/26/2017.
 */

angular.module('filetree.directive', [])

    .controller('Controller', ['$scope', function($scope) {
        $scope.data = [{
            "id": 1,
            "title": "folder1",
            "nodes": [
                {
                    "id": 11,
                    "title": "folder1.1",
                    "nodes": [
                        {
                            "id": 111,
                            "title": "folder1.1.1",
                            "nodes": []
                        }
                    ]
                },
                {
                    "id": 12,
                    "title": "folder1.2",
                    "nodes": []
                }
            ],
        }, {
            "id": 2,
            "title": "folder2",
            "nodes": [
                {
                    "id": 21,
                    "title": "folder2.1",
                    "nodes": []
                },
                {
                    "id": 22,
                    "title": "folder2.2",
                    "nodes": []
                }
            ],
        }, {
            "id": 3,
            "title": "folder3",
            "nodes": [
                {
                    "id": 31,
                    "title": "folder3.1",
                    "nodes": []
                }
            ],
        }, {
            "id": 4,
            "title": "folder4",
            "nodes": [
                {
                    "id": 41,
                    "title": "folder4.1",
                    "nodes": []
                }
            ],
        }];
    }])

    .directive('myCustomer', function() {
        return {
            restrict: "E",
            templateUrl: "./views/filetree/page/filetree.html"
        };
    });


