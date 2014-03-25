var routes = angular.module('healthpass.routes', ['ngRoute']);

routes.config(function($routeProvider) {
  $routeProvider
    .when('/', { templateUrl: '/app/views/home.html', controller:"HomeController" })
    .when('/passport', { templateUrl: '/app/views/passport.html', controller:"PassportController" })
    .when('/passport/edit', { templateUrl: '/app/views/passport-edit.html', controller:"PassportEditController" })
    .when('/events', { templateUrl: '/app/views/events.html', controller:"EventsController" })
    .when('/signup', { templateUrl: '/app/views/signup.html', controller:"SignupController" })
    .when('/happy', { templateUrl: '/app/views/emotion.html', controller:"EmotionController" })
    .when('/sad', { templateUrl: '/app/views/emotion.html', controller:"EmotionController" })
    .when('/pain', { templateUrl: '/app/views/emotion.html', controller:"EmotionController" })
    .when('/contacts', { templateUrl: '/app/views/contacts.html', controller:"ContactsController"})
    .when('/add_contact', { templateUrl: '/app/views/add_contact.html', controller:"AddContactController"})
    .when('/add_event', { templateUrl: '/app/views/add_event.html', controller:"AddEventController"})
    .when('/allergies',{templateUrl:'/app/views/allergies.html', controller:"AllergyController"})
    .when('/questions',{templateUrl:'/app/views/questions.html', controller:"QuestionsController"})

});