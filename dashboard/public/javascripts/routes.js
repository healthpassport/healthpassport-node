var dashboardApp=angular.module('dashboardApp',['ngRoute']);
dashboardApp.config(function($routeProvider){
	$routeProvider
	.when('/home',{templateUrl: '/partials/home.html', controller: 'HomeController'})
	.when('/login',{templateUrl: '/partials/login.html', controller: 'LoginController'})
	.when('/patient',{templateUrl:'/partials/patient.html',controller: 'PatientController'})
	.when('/createUser',{templateUrl:'/partials/createUser.html', controller: 'CreateUserController'});
});