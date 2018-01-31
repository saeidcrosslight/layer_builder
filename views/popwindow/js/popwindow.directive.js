'use strict';

angular
        .module('popwindow.directive', [])        
        .directive('usersetting', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/usersetting.html'
            };
        })
        
        .directive('selectproject', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/selectproject.html'
            };
        })
        
        .directive('rename', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/rename.html'
            };
        })
        
        .directive('deletefile', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/deletefile.html'
            };
        })
        
        .directive('property', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/property.html'
            };
        })
        
        .directive('newproject', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/newproject.html'
            };
        })
        
        .directive('newfile', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/newfile.html'
            };
        })
        
        .directive('materdefine', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/materdefine.html'
            };
        })
        
        .directive('preference', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/preference.html'
            };
        })
        
        .directive('networkcompute', function () {
            return {
                replace: true,
                restrict: 'EA',
                templateUrl: 'views/popwindow/page/networkcompute.html'
            };
        })
        ;