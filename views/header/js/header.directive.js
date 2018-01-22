'use strict';

angular
        .module('header.directive', [])
        .directive('layerbuilderheader', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/header/page/header.html'
            };
        })
        
