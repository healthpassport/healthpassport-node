var healthcordova = angular.module('healthcordova', [
  'healthpass', // dependencies from main app
  'healthcordova.authentication', // HTTP Basic Auth for Cordova/Angular/Node
  'healthcordova.controllers', // Extra logic for cordova
  'healthcordova.directives' // Extra logic (e.g camera)
])
.config(function ($routeProvider, $locationProvider, $httpProvider) {
  // makes sure that healthcordova.authentication#httpInterceptor is added
  $httpProvider.responseInterceptors.push('httpInterceptor');
});