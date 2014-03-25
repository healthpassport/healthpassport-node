var routes = angular.module('healthpass.routes', ['ngRoute']);

routes.config(function($routeProvider) {
  $routeProvider
    .when('/', { templateUrl: '/app/healthpass/views/home.html', controller:"HomeController" })
    .when('/passport', { templateUrl: '/app/healthpass/views/passport.html', controller:"PassportController" })
    .when('/passport/edit', { templateUrl: '/app/healthpass/views/passport-edit.html', controller:"PassportEditController" })
    .when('/events', { templateUrl: '/app/healthpass/views/events.html', controller:"EventsController" })
    .when('/signup', { templateUrl: '/app/healthpass/views/signup.html', controller:"SignupController" })
    .when('/happy', { templateUrl: '/app/healthpass/views/emotion.html', controller:"EmotionController" })
    .when('/sad', { templateUrl: '/app/healthpass/views/emotion.html', controller:"EmotionController" })
    .when('/pain', { templateUrl: '/app/healthpass/views/emotion.html', controller:"EmotionController" })
    .when('/contacts', { templateUrl: '/app/healthpass/views/contacts.html', controller:"ContactsController"})
    .when('/add_contact', { templateUrl: '/app/healthpass/views/add_contact.html', controller:"AddContactController"})
    .when('/add_event', { templateUrl: '/app/healthpass/views/add_event.html', controller:"AddEventController"})
    .when('/allergies',{templateUrl:'/app/healthpass/views/allergies.html', controller:"AllergyController"})
    .when('/questions',{templateUrl:'/app/healthpass/views/questions.html', controller:"QuestionsController"})

});