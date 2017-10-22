var app = angular.module('myApp', []);

app.controller('MainController', ['$scope',
function ($scope,$route,$rootScope){
    $scope.testinga = "lasd";

    $scope.doSomething = function(){
        console.log("did something");
    }
}]);