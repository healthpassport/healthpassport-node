var healthpass = angular.module('healthpass', ['ngRoute']);

healthpass.config(function($routeProvider) {
  $routeProvider
    .when('/', { templateUrl: '/app/views/home.html', controller:"HomeController" })
    .when('/likes', { templateUrl: '/app/views/likes.html', controller:"LikesController" })
});

healthpass.controller("BarController", function($scope, $location) {
    $scope.routeIs = function (routeName) { return $location.path() === routeName; };
});

healthpass.controller("HomeController", function($scope) {
  
});

healthpass.controller("LikesController", function($scope) {
  $scope.likes = ["one", "two"]
});

healthpass.controller("AllergiesController", function($scope) {
  $scope.allergies = [
    {name:"nicola", date: new Date("01-01-2013")},
    {name:"raluca", date: new Date("01-02-2013")},
    {name:"martin", date: new Date("01-03-2013")},
    {name:"max", date: new Date("01-04-2013")},
    {name:"john", date: new Date("01-05-2013")}
  ];

  $scope.add = function(searchValue) {
    searchValue.date = new Date();
    $scope.allergies.push(searchValue);
    $scope.search = {};
  }
})