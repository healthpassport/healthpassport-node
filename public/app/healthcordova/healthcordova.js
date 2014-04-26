var healthcordova = angular.module('healthcordova', ['healthpass'])

healthcordova.controller('CordovaMainController', function(cordovaValue, $scope, Me, $location) {

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