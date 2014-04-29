angular.module('healthpass.controllers', ['healthpass.factories'])

// MainController: Wraps the ngView for web app
.controller('MainController', function(cordovaValue, $scope, Me, $location) {
  
  // Get the user
  Me.promise.then(function(user) {
    $scope.me = user;
  });
  
  // Helper to find what routes we are in
  $scope.isRoute = function(route) {
    return $location.path() == route;
  }

})

// AddEventController: Adding new events
.controller('AddEventController', function($scope, Me, $location) {

  $scope.saveEvent = function(data) {
    $scope.me.addEvent(data).then(function() {  
      $location.path("/events");
    });
  }

})

// QuestionController: Answering doctor questions
.controller('QuestionController',function($scope, Me, Question){
  
  // Save answer of a Question
  $scope.saveAnswer=function(question, answer){

    question.saveAnswer(answer).then(function(data) {
      console.log("ANSWERED", data)   //NOT EXECUTED
    });

  }
})

// AddContactController: Add contacts in contact list
.controller('AddContactController', function($scope, $location, Me) {

  $scope.data = {};

  $scope.goBack = function(){
    $location.path('/contacts');
  }

  // Save contact on profile
  $scope.saveContact = function(data){
    $scope.me.addContact(data).then(function(){
      $location.path('/contacts');
    });
  }

})

// AllergyController: Select and deselect allergies
.controller('AllergyController', function($scope, Me){
  
  $scope.data={};

  $scope.presetAllergies=[{name: 'peanuts'}, {name: 'milk'},{name: 'dust'},{name: 'banana'}].map(function(one) { one.active = 0; return one;});
  var preset_allergies = $scope.presetAllergies.map(function(allergy) {return angular.copy(allergy.name);});
  $scope.presetAllergies=[{name: 'peanuts'}, {name: 'milk'},{name: 'dust'},{name: 'banana'}];
  $scope.notSelectedAllergies = [];
  
  var preset_allergies = $scope.presetAllergies.map(function(allergy) {return angular.copy(allergy.name)});
  
  Me.promise.then(function() {
    
    // iterate through all the existing allergies
    for (var i = 0; i < $scope.presetAllergies.length; i++) {
      var current_allergy = angular.copy($scope.presetAllergies[i]);

      // iterate through all the user allergies
      var found = false;
      for (var j = 0; j < $scope.me.allergies.length; j++) {
        var current_user_allergy = $scope.me.allergies[j];
        if (current_allergy.name == current_user_allergy.name) {
          found = true;
          break;
        }
      }
      if (!found) $scope.notSelectedAllergies.push(current_allergy);
    }
    
  });
  
  $scope.addAllergy = function(allergy) {
    $scope.me.addAllergy(allergy).then(function() {
      for (var i=0; i < $scope.notSelectedAllergies.length; i++) {
        if (allergy.name == $scope.notSelectedAllergies[i].name) {
          $scope.notSelectedAllergies.splice(i, 1);
          break;
        }
      }
    })
  }
  
  $scope.removeAllergy = function(allergy) {
    $scope.me.removeAllergy(allergy).then(function() {
      $scope.notSelectedAllergies.push(allergy)
    })
  }

})

// PassportEditController: Handle logic for editing passport
.controller('PassportEditController', function($scope, $location) {
  $scope.saveMe = function(me) {
    me.save(me._id).then(function() {
      $location.path("/passport")
    })
  }
})
// EmotionController: Handle logic for adding emotions
.controller('EmotionController', function($scope, Me, Location, $location) {
  $scope.data = {}
  $scope.data.emotion_type = $location.path().substr(1)

  $scope.saveEmotion = function(data, localurl) {

    // First get location
    Location.get(function(location){

      // assign coordinates
      data.lon = location.lon;
      data.lat = location.lat;

      // localurl will contain an image in case added
      if (localurl) data.localurl = localurl;
      
      // add the emotion
      Me.user.addEmotion(data, localurl).then(function() {

        // back to main page
        $location.path('/');
      });
    });

  }

  $scope.$watch('myPicture', function(data) {
    if (data) {
      $scope.localurl = data;
    }
  }, true);

})
.controller('PassportController', function($scope, Patient) {
  $scope.disability_level = Patient.disability_level
  $scope.understanding_level = Patient.understanding_level
  $scope.communication_type = Patient.communication_type
})
// Placeholder controllers
.controller('WebcamController', function($scope, Picture, Me) {

  $scope.$watch('myPicture', function(data) {
    if (data) {
      Me.user.addPicture(data)
    }
  }, true);
})
.controller('HomeController', function($scope, Me, $req, cordovaValue, $location, $window) {})
.controller('SignupController', function($scope) {})
.controller('ContactsController', function($scope, $location, Me) {})
.controller('EventsController', function($scope, $location, Me) {})
.controller('QuestionsController',function($scope, Me){})