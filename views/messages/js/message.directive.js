angular
        .module('message.directive',[])

        .controller('messageTabContrller', ['$scope', function($scope) {
           $scope.name = "Saeid";
        }])

        .directive('messageTab', function () {
            return {
                restrict: "E",
                templateUrl: "./views/messages/page/message.html"
            };

        });