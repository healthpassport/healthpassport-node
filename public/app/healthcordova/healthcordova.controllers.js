angular.module('healthcordova.controllers', ['healthcordova.authentication', 'healthpass.factories'])
// CordovaMainController: Main controller that wraps the ngView
.controller('CordovaMainController', function($scope, Me, $location, $rootScope, Auth) {  

  // Get the user, if no user, login
  Me.promise.then(
    function(user) {
      if (!user) $location.path("/login")
      $rootScope.me = user;
    },
    function(err) {
      // Here the user has got 401/500
      console.log(err)
      $location.path("/login")
    });
  
  // isRoute: Check current path
  $scope.isRoute = function(route) {
    return $location.path() == route;
  }

  // logout: logs user out
  $scope.logout = function() {
    Auth.clearCredentials()
    $location.path('/login')
  }

})
.controller('LoginController', function($scope, Me, Auth, $rootScope, $location) {

  // login: trigger log in and get user
  $scope.login = function(data) {
    Auth.setCredentials(data.username, data.password);

    // Get current user for credentials
    Me.getMe().then(
      function(user) {
        if (!user) $location.path("/login")
        $rootScope.me = user;
        $location.path("/")
      },
      function(err) {
        alert("Password or username not correct")
        console.log(err)
        $scope.data = {}
      });

  }
})