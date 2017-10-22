var app = angular.module('myApp', []);

app.controller('MainController', ['$http','$scope',
function ($http,$scope,$route,$rootScope){
    $scope.jsonData;

    $scope.doSomething = function(){
        console.log("did something");
    }

    $scope.hoverOver = function(element){
        $scope['element' + element.target.id] = {'fill':'blue'};
    }

    $scope.hoverLeave = function(element){
        $scope['element' + element.target.id] = {'fill':'#b9b9b9'};
    }

    $scope.loadJson = function(){
        $scope.jsonData = $http.get('contact.json').success(function(response) {
            return response.data;
        });
    }
}]);