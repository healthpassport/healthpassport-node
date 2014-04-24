var controllers = angular.module('healthpass.controllers', ['healthpass.factories']);

controllers.controller('MainController', function(cordovaValue, $scope, Me, $location, CordovaService) {
  
  Me.promise.then(function(user) {
    $scope.me = user;
  });

  CordovaService.ready.then(function(c) {
    if (c) cordovaValue = 1;
  })
  
  $scope.isRoute = function(route) {
    return $location.path() == route;
  }

});