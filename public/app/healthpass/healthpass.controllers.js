var controllers = angular.module('healthpass.controllers', ['healthpass.factories']);

controllers.controller('MainController', function(cordovaValue, $scope, Me, $location, CordovaService) {
  
  Me.promise.then(function(user) {
    $scope.me = user;
  });
  
  $scope.isRoute = function(route) {
    return $location.path() == route;
  }

});

controllers.controller('CordovaMainController', function(cordovaValue, $scope, Me, $location, CordovaService) {

  alert("CordovaMainController")
  Me.promise.then(function(user) {
    if (!user) $location.path("/login")
    $scope.me = user;
  }, function(err) {
    alert("error when you")
    console.log(err)
    $location.path("/login")
  });
  
  $scope.isRoute = function(route) {
    return $location.path() == route;
  }

});