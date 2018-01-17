angular
        .module('message.directive',[])

        .controller('messageTabContrller', ['$scope', function($scope) {
           $scope.name = "CrossLight";
        }])

        .directive('messageTab', function () {
            return {
                restrict: "E",
                templateUrl: "./views/messages/page/message.html"
            };
        });