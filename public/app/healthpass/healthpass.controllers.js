var controllers = angular.module('healthpass.controllers', ['healthpass.factories']);

controllers.controller('MainController', function($scope, Me, $location) {
  
  Me.promise.then(function(user) {
    $scope.me = user;
  });
  
  $scope.isRoute = function(route) {
    return $location.path() == route;
  }

});
